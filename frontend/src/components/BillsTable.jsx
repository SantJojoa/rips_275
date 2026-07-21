import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ChevronDown, ChevronUp, Loader2, FileJson, FileText, FileCode, Download, RefreshCw, Search, EyeOff, Eye } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { deleteBill } from '../api/billsApi';
import { isAdmin } from '../lib/auth';
import { createPortal } from 'react-dom';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const TIPOS = [
    { key: 'num_usuarios',          label: 'Usuarios',           color: '#7C3AED' },
    { key: 'num_consultas',         label: 'Consultas',          color: '#1F6C9F' },
    { key: 'num_procedimientos',    label: 'Procedimientos',     color: '#0891B2' },
    { key: 'num_medicamentos',      label: 'Medicamentos',       color: '#15803D' },
    { key: 'num_hospitalizaciones', label: 'Hospitalizaciones',  color: '#B45309' },
    { key: 'num_urgencias',         label: 'Urgencias',          color: '#B91C1C' },
    { key: 'num_otros',             label: 'Otros',              color: '#6B7280' },
];

function Pill({ n, label, color }) {
    if (!n || Number(n) === 0) return null;
    return (
        <span style={{ backgroundColor: color + '18', color, borderRadius: 6, padding: '2px 7px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
            {Number(n)} {label}
        </span>
    );
}

function StatCard({ label, value, color }) {
    return (
        <div style={{ border: '1px solid #EAEAEA', borderRadius: 10, backgroundColor: '#fff', padding: '14px 18px' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#787774', textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: color || '#111111' }}>{value}</p>
        </div>
    );
}

// ─── Modal confirmación eliminar con motivo ───────────────────────────────────
function ConfirmModal({ factura, onConfirm, onCancel }) {
    const [motivo, setMotivo] = useState('');

    return createPortal(
        <div
            style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: 'rgba(0,0,0,0.45)' }}
            onClick={onCancel}
        >
            <div
                style={{ backgroundColor: '#fff', borderRadius: 14, padding: '28px 24px', width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}
                onClick={e => e.stopPropagation()}
            >
                <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#111111', marginBottom: 4 }}>¿Desactivar factura?</p>
                    <p style={{ fontSize: 13, color: '#787774' }}>
                        Se desactivará la factura <span style={{ fontWeight: 600, color: '#111111' }}>{factura.num_factura}</span>. Esta acción queda registrada.
                    </p>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#787774', marginBottom: 6 }}>
                        Motivo de desactivación <span style={{ color: '#B91C1C' }}>*</span>
                    </label>
                    <textarea
                        value={motivo}
                        onChange={e => setMotivo(e.target.value)}
                        placeholder="Ej: Factura duplicada, error en datos..."
                        rows={3}
                        autoFocus
                        style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #D1D5DB', fontSize: 13, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                        onFocus={e => e.target.style.borderColor = '#462882'}
                        onBlur={e => e.target.style.borderColor = '#D1D5DB'}
                    />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={onCancel} style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: '1px solid #EAEAEA', backgroundColor: '#F9F9F8', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#111111' }}>Cancelar</button>
                    <button
                        onClick={() => motivo.trim() && onConfirm(motivo.trim())}
                        disabled={!motivo.trim()}
                        style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', backgroundColor: motivo.trim() ? '#B91C1C' : '#E5E5E5', fontSize: 13, fontWeight: 600, cursor: motivo.trim() ? 'pointer' : 'not-allowed', color: motivo.trim() ? '#fff' : '#999' }}
                    >
                        Desactivar
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ─── Tarjeta de registro activo ───────────────────────────────────────────────
function RegistroCard({ r, onDelete, onDescargar, onBuscarRips, canDelete }) {
    const [open, setOpen] = useState(false);

    const fecha  = new Date(r.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: '2-digit' });
    const valor  = r.valor_factura != null ? `$${Number(r.valor_factura).toLocaleString('es-CO')}` : '—';
    const usuario = [r.usuario_nombres, r.usuario_apellidos].filter(Boolean).join(' ') || r.username || '—';

    const archivos = [
        { tipo: 'RIP', file: r.archivos?.rip, icon: FileJson, color: '#1F6C9F' },
        { tipo: 'CUV', file: r.archivos?.cuv, icon: FileText, color: '#15803D' },
        { tipo: 'XML', file: r.archivos?.xml, icon: FileCode, color: '#B45309' },
    ];

    return (
        <div style={{ border: '1px solid #EAEAEA', borderRadius: 10, backgroundColor: '#fff', overflow: 'hidden' }}>
            <button
                onClick={() => setOpen(v => !v)}
                style={{ width: '100%', textAlign: 'left', padding: '13px 18px', cursor: 'pointer', background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: '#111111' }}>{r.numero_radicado || '—'}</span>
                        {r.numero_cuenta_cobro && (
                            <span style={{ fontSize: 11, color: '#1F6C9F', backgroundColor: '#E1F3FE', padding: '1px 7px', borderRadius: 5, fontFamily: 'monospace' }}>Cta. Cobro: {r.numero_cuenta_cobro}</span>
                        )}
                        <span style={{ fontSize: 11, color: '#787774', backgroundColor: '#F0F0EF', padding: '1px 7px', borderRadius: 5 }}>{fecha}</span>
                        <span style={{ fontSize: 11, color: '#462882', backgroundColor: '#F0EBF8', padding: '1px 7px', borderRadius: 5 }}>{usuario}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#787774', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.nombre_prestador || '—'} · Factura <span style={{ fontWeight: 600, color: '#111111' }}>{r.num_factura}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#111111' }}>{valor}</span>
                    <button
                        onClick={e => { e.stopPropagation(); onBuscarRips(r.num_factura); }}
                        style={{ padding: '5px', borderRadius: 6, border: '1px solid #BFDBFE', backgroundColor: '#EFF6FF', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        title="Ver en consulta RIPS"
                    >
                        <Search style={{ width: 14, height: 14, color: '#1D4ED8' }} />
                    </button>
                    {canDelete && (
                        <button
                            onClick={e => { e.stopPropagation(); onDelete(r); }}
                            style={{ padding: '5px', borderRadius: 6, border: '1px solid #FECACA', backgroundColor: '#FEF2F2', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            title="Desactivar factura"
                        >
                            <Trash2 style={{ width: 14, height: 14, color: '#B91C1C' }} />
                        </button>
                    )}
                    {open ? <ChevronUp style={{ width: 15, height: 15, color: '#787774' }} /> : <ChevronDown style={{ width: 15, height: 15, color: '#787774' }} />}
                </div>
            </button>

            {open && (
                <div style={{ borderTop: '1px solid #F0F0EF', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                        {[
                            { label: 'Período',         value: `${r.periodo_fac}/${r['año'] ?? r.año}` },
                            { label: 'NIT',              value: r.num_nit },
                            { label: 'Prestador',        value: r.nombre_prestador },
                            { label: 'Valor',            value: valor },
                            { label: 'Usuario',          value: usuario },
                            { label: 'Fecha',            value: fecha },
                            { label: 'Cuenta de Cobro',  value: r.numero_cuenta_cobro },
                        ].map((item, i) => (
                            <div key={i} style={{ backgroundColor: '#F9F9F8', borderRadius: 8, padding: '8px 12px' }}>
                                <p style={{ fontSize: 10, fontWeight: 600, color: '#787774', textTransform: 'uppercase', marginBottom: 2 }}>{item.label}</p>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#111111', wordBreak: 'break-word' }}>{item.value || '—'}</p>
                            </div>
                        ))}
                    </div>

                    <div>
                        <p style={{ fontSize: 11, fontWeight: 600, color: '#787774', textTransform: 'uppercase', marginBottom: 6 }}>Resumen RIP</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {TIPOS.map(t => <Pill key={t.key} n={r[t.key]} label={t.label} color={t.color} />)}
                            {TIPOS.every(t => !r[t.key] || Number(r[t.key]) === 0) && (
                                <span style={{ fontSize: 12, color: '#787774', fontStyle: 'italic' }}>Sin datos de servicios</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <p style={{ fontSize: 11, fontWeight: 600, color: '#787774', textTransform: 'uppercase', marginBottom: 6 }}>Archivos</p>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {archivos.map(({ tipo, file, icon: Icon, color }) => (
                                file ? (
                                    <button key={tipo} onClick={() => onDescargar(r.transaccion_id, file)}
                                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: `1px solid ${color}30`, backgroundColor: color + '10', cursor: 'pointer', fontSize: 12, fontWeight: 600, color }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = color + '20'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = color + '10'}
                                    >
                                        <Icon style={{ width: 14, height: 14 }} />
                                        <Download style={{ width: 12, height: 12 }} />
                                        {tipo}
                                    </button>
                                ) : (
                                    <span key={tipo} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1px solid #EAEAEA', backgroundColor: '#F9F9F8', fontSize: 12, color: '#BBBBBB' }}>
                                        <Icon style={{ width: 14, height: 14 }} />{tipo}
                                    </span>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Tarjeta de registro INACTIVO ─────────────────────────────────────────────
function RegistroInactivoCard({ r }) {
    const [open, setOpen] = useState(false);
    const fechaCreacion     = new Date(r.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: '2-digit' });
    const fechaDesactivacion = r.fecha_desactivacion
        ? new Date(r.fecha_desactivacion).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: '2-digit' })
        : '—';
    const valor  = r.valor_factura != null ? `$${Number(r.valor_factura).toLocaleString('es-CO')}` : '—';
    const usuario = [r.usuario_nombres, r.usuario_apellidos].filter(Boolean).join(' ') || r.username || '—';

    return (
        <div style={{ border: '1px solid #FECACA', borderRadius: 10, backgroundColor: '#FFF8F8', overflow: 'hidden' }}>
            <button
                onClick={() => setOpen(v => !v)}
                style={{ width: '100%', textAlign: 'left', padding: '13px 18px', cursor: 'pointer', background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: '#111111' }}>{r.numero_radicado || '—'}</span>
                        <span style={{ fontSize: 11, color: '#fff', backgroundColor: '#B91C1C', padding: '1px 7px', borderRadius: 5 }}>INACTIVA</span>
                        <span style={{ fontSize: 11, color: '#787774', backgroundColor: '#F0F0EF', padding: '1px 7px', borderRadius: 5 }}>Creada: {fechaCreacion}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#787774', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.nombre_prestador || '—'} · Factura <span style={{ fontWeight: 600, color: '#111111' }}>{r.num_factura}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#111111' }}>{valor}</span>
                    {open ? <ChevronUp style={{ width: 15, height: 15, color: '#787774' }} /> : <ChevronDown style={{ width: 15, height: 15, color: '#787774' }} />}
                </div>
            </button>

            {open && (
                <div style={{ borderTop: '1px solid #FECACA', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                        {[
                            { label: 'Período',           value: `${r.periodo_fac}/${r['año'] ?? r.año}` },
                            { label: 'NIT',               value: r.num_nit },
                            { label: 'Prestador',         value: r.nombre_prestador },
                            { label: 'Valor',             value: valor },
                            { label: 'Usuario',           value: usuario },
                            { label: 'Desactivada el',    value: fechaDesactivacion },
                            { label: 'Cuenta de Cobro',   value: r.numero_cuenta_cobro },
                        ].map((item, i) => (
                            <div key={i} style={{ backgroundColor: '#FEF2F2', borderRadius: 8, padding: '8px 12px' }}>
                                <p style={{ fontSize: 10, fontWeight: 600, color: '#787774', textTransform: 'uppercase', marginBottom: 2 }}>{item.label}</p>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#111111', wordBreak: 'break-word' }}>{item.value || '—'}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ backgroundColor: '#FEF2F2', borderRadius: 8, padding: '10px 14px', borderLeft: '3px solid #B91C1C' }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: '#787774', textTransform: 'uppercase', marginBottom: 4 }}>Motivo de desactivación</p>
                        <p style={{ fontSize: 13, color: '#111111' }}>{r.motivo_desactivacion || 'Sin motivo registrado'}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function BillsTable() {
    const navigate = useNavigate();
    const canDelete = isAdmin();

    const [registros,    setRegistros]    = useState([]);
    const [inactivos,    setInactivos]    = useState([]);
    const [verInactivos, setVerInactivos] = useState(false);
    const [loading,      setLoading]      = useState(true);
    const [loadingInact, setLoadingInact] = useState(false);
    const [error,        setError]        = useState(null);
    const [confirmando,  setConfirmando]  = useState(null);

    const [busqueda,        setBusqueda]        = useState('');
    const [filtroPrestador, setFiltroPrestador] = useState('');
    const [filtroUsuario,   setFiltroUsuario]   = useState('');
    const [fechaDesde,      setFechaDesde]      = useState('');
    const [fechaHasta,      setFechaHasta]      = useState('');
    const [filtroPeriodo,   setFiltroPeriodo]   = useState('');

    const cargar = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res  = await apiFetch('/api/auth/todos-registros');
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || 'Error');
            setRegistros(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const cargarInactivos = useCallback(async () => {
        setLoadingInact(true);
        try {
            const res  = await apiFetch('/api/bills/inactivas');
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || 'Error');
            setInactivos(data);
        } catch {
            setInactivos([]);
        } finally {
            setLoadingInact(false);
        }
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    const toggleInactivos = () => {
        if (!verInactivos && inactivos.length === 0) cargarInactivos();
        setVerInactivos(v => !v);
    };

    const prestadores = [...new Map(registros.map(r => [r.prestador_id, r.nombre_prestador])).entries()]
        .filter(([id]) => id).map(([id, nombre]) => ({ id, nombre }));

    const usuarios = [...new Map(registros.map(r => [r.id_system_user, { id: r.id_system_user, label: [r.usuario_nombres, r.usuario_apellidos].filter(Boolean).join(' ') || r.username || '—' }])).entries()]
        .filter(([id]) => id).map(([, v]) => v);

    const hayFiltros = busqueda || filtroPrestador || filtroUsuario || fechaDesde || fechaHasta || filtroPeriodo;
    const filtrados  = registros.filter(r => {
        if (busqueda.trim()) {
            const q = busqueda.trim().toLowerCase();
            if (!String(r.num_factura || '').toLowerCase().includes(q) &&
                !String(r.numero_radicado || '').toLowerCase().includes(q) &&
                !String(r.numero_cuenta_cobro || '').toLowerCase().includes(q)) return false;
        }
        if (filtroPrestador && String(r.prestador_id) !== filtroPrestador) return false;
        if (filtroUsuario   && String(r.id_system_user) !== filtroUsuario) return false;
        if (fechaDesde && new Date(r.fecha) < new Date(fechaDesde)) return false;
        if (fechaHasta) {
            const h = new Date(fechaHasta); h.setHours(23, 59, 59, 999);
            if (new Date(r.fecha) > h) return false;
        }
        if (filtroPeriodo.trim()) {
            const mm   = String(r.periodo_fac || '').padStart(2, '0');
            const yyyy = String(r['año'] ?? r.año ?? '');
            if (!`${mm}/${yyyy}`.includes(filtroPeriodo.trim())) return false;
        }
        return true;
    });

    const totalValor = filtrados.reduce((s, r) => s + (Number(r.valor_factura) || 0), 0);

    const handleDescargar = async (transaccionId, filename) => {
        try {
            const res = await apiFetch(`/api/auth/descargar-archivo-admin?transaccionId=${transaccionId}&filename=${encodeURIComponent(filename)}`);
            if (!res.ok) { alert('No se pudo descargar el archivo'); return; }
            const blob = await res.blob();
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href = url; a.download = filename; a.click();
            URL.revokeObjectURL(url);
        } catch {
            alert('Error al descargar');
        }
    };

    const handleEliminar = async (motivo) => {
        if (!confirmando) return;
        try {
            await deleteBill(confirmando.transaccion_id, motivo);
            setConfirmando(null);
            cargar();
            if (verInactivos) cargarInactivos();
        } catch (e) {
            alert('Error al desactivar: ' + e.message);
        }
    };

    const limpiar = () => {
        setBusqueda(''); setFiltroPrestador(''); setFiltroUsuario('');
        setFechaDesde(''); setFechaHasta(''); setFiltroPeriodo('');
    };

    const inputStyle = { width: '100%', padding: '6px 10px', borderRadius: 7, border: '1px solid #D1D5DB', fontSize: 13, outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff' };
    const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: '#787774', textTransform: 'uppercase', marginBottom: 4 };

    return (
        <div className="fade-up fade-up-1">
            <div className="mb-5 flex items-end justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-xl font-semibold text-[#111111] tracking-tight">Gestionar facturas</h1>
                    <p className="mt-1 text-sm text-[#787774]">Todas las facturas registradas en el sistema.</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={toggleInactivos}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: `1px solid ${verInactivos ? '#B91C1C' : '#EAEAEA'}`, backgroundColor: verInactivos ? '#FEF2F2' : '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: verInactivos ? '#B91C1C' : '#111111' }}
                    >
                        {verInactivos ? <Eye style={{ width: 14, height: 14 }} /> : <EyeOff style={{ width: 14, height: 14 }} />}
                        {verInactivos ? 'Ver activas' : 'Ver desactivadas'}
                    </button>
                    <button
                        onClick={cargar}
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid #EAEAEA', backgroundColor: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, color: '#111111' }}
                    >
                        <RefreshCw style={{ width: 14, height: 14 }} className={loading ? 'animate-spin' : ''} />
                        Actualizar
                    </button>
                </div>
            </div>

            {/* Vista INACTIVAS */}
            {verInactivos && (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '10px 14px', borderRadius: 8, backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                        <EyeOff style={{ width: 14, height: 14, color: '#B91C1C' }} />
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#B91C1C' }}>Mostrando facturas desactivadas — {inactivos.length} registro(s)</p>
                    </div>
                    {loadingInact && <div style={{ textAlign: 'center', padding: '32px 0' }}><Loader2 style={{ width: 28, height: 28, color: '#B91C1C', margin: '0 auto' }} className="animate-spin" /></div>}
                    {!loadingInact && inactivos.length === 0 && (
                        <div style={{ border: '1px solid #EAEAEA', borderRadius: 10, backgroundColor: '#F9F9F8', padding: '32px 0', textAlign: 'center' }}>
                            <p style={{ fontSize: 14, color: '#787774' }}>No hay facturas desactivadas.</p>
                        </div>
                    )}
                    {!loadingInact && inactivos.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {inactivos.map(r => <RegistroInactivoCard key={r.transaccion_id || r.control_id} r={r} />)}
                        </div>
                    )}
                </div>
            )}

            {/* Vista ACTIVAS */}
            {!verInactivos && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 18 }}>
                        <StatCard label="Total facturas" value={filtrados.length} />
                        <StatCard label="Valor total"    value={`$${totalValor.toLocaleString('es-CO')}`} color="#15803D" />
                        <StatCard label="Promedio"       value={filtrados.length ? `$${Math.round(totalValor / filtrados.length).toLocaleString('es-CO')}` : '—'} color="#B45309" />
                    </div>

                    <div style={{ border: '1px solid #EAEAEA', borderRadius: 10, backgroundColor: '#fff', padding: '14px 18px', marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
                        <div style={{ flex: '1 1 160px', minWidth: 0 }}>
                            <label style={labelStyle}>Factura / Radicado / Cta. Cobro</label>
                            <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar..." style={inputStyle} />
                        </div>
                        <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                            <label style={labelStyle}>Prestador</label>
                            <select value={filtroPrestador} onChange={e => setFiltroPrestador(e.target.value)} style={inputStyle}>
                                <option value="">Todos</option>
                                {prestadores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: '1 1 160px', minWidth: 0 }}>
                            <label style={labelStyle}>Usuario</label>
                            <select value={filtroUsuario} onChange={e => setFiltroUsuario(e.target.value)} style={inputStyle}>
                                <option value="">Todos</option>
                                {usuarios.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: '1 1 130px', minWidth: 0 }}>
                            <label style={labelStyle}>Fecha desde</label>
                            <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} style={inputStyle} />
                        </div>
                        <div style={{ flex: '1 1 130px', minWidth: 0 }}>
                            <label style={labelStyle}>Hasta</label>
                            <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} style={inputStyle} />
                        </div>
                        <div style={{ flex: '1 1 110px', minWidth: 0 }}>
                            <label style={labelStyle}>Período</label>
                            <input type="text" value={filtroPeriodo} onChange={e => setFiltroPeriodo(e.target.value)} placeholder="MM/YYYY" style={inputStyle} />
                        </div>
                        {hayFiltros && (
                            <button onClick={limpiar} style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid #EAEAEA', backgroundColor: '#F9F9F8', fontSize: 12, fontWeight: 600, color: '#787774', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                Limpiar
                            </button>
                        )}
                    </div>

                    {hayFiltros && <p style={{ fontSize: 12, color: '#787774', marginBottom: 8 }}>{filtrados.length} de {registros.length} registros</p>}

                    {loading && (
                        <div style={{ textAlign: 'center', padding: '48px 0' }}>
                            <Loader2 style={{ width: 32, height: 32, color: '#1F6C9F', margin: '0 auto' }} className="animate-spin" />
                            <p style={{ marginTop: 12, fontSize: 14, color: '#787774' }}>Cargando registros...</p>
                        </div>
                    )}
                    {error && !loading && (
                        <div style={{ border: '1px solid #FECACA', borderRadius: 10, backgroundColor: '#FEF2F2', padding: '14px 18px' }}>
                            <p style={{ fontSize: 13, color: '#B91C1C', fontWeight: 600 }}>Error: {error}</p>
                        </div>
                    )}
                    {!loading && !error && registros.length === 0 && (
                        <div style={{ border: '1px solid #EAEAEA', borderRadius: 10, backgroundColor: '#F9F9F8', padding: '48px 0', textAlign: 'center' }}>
                            <p style={{ fontSize: 14, color: '#787774' }}>No hay facturas registradas.</p>
                        </div>
                    )}
                    {!loading && !error && registros.length > 0 && filtrados.length === 0 && (
                        <div style={{ border: '1px solid #EAEAEA', borderRadius: 10, backgroundColor: '#F9F9F8', padding: '32px 0', textAlign: 'center' }}>
                            <p style={{ fontSize: 14, color: '#787774' }}>Ningún registro coincide con los filtros.</p>
                        </div>
                    )}
                    {!loading && filtrados.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {filtrados.map(r => (
                                <RegistroCard
                                    key={r.transaccion_id || r.control_id}
                                    r={r}
                                    onDelete={setConfirmando}
                                    onDescargar={handleDescargar}
                                    onBuscarRips={num => navigate(`/consultar?factura=${encodeURIComponent(num)}`)}
                                    canDelete={canDelete}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {confirmando && (
                <ConfirmModal
                    factura={confirmando}
                    onConfirm={handleEliminar}
                    onCancel={() => setConfirmando(null)}
                />
            )}
        </div>
    );
}
