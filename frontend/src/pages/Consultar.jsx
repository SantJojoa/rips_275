import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Download, FileJson, FileText, FileCode, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import Select from 'react-select';
import { isAdmin } from '../lib/auth';
import { apiFetch } from '../lib/api';
import { SearchBill } from '../services/searchBill.js';
import { exportFacturaToExcel } from '../utils/exportToExcel';
import RenderTabla from '../components/RenderTabla';
import { showError, showSuccess } from '../utils/toastUtils';

// ─── Componente vista ADMIN (búsqueda por factura) ───────────────────────────
function ConsultarAdmin() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [numFactura, setNumFactura] = useState(searchParams.get('factura') || '');
    const [loading, setLoading]       = useState(false);
    const [data, setData]             = useState(null);
    const [activeTab, setActiveTab]   = useState('consultas');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [visibleColsByTab, setVisibleColsByTab] = useState({});
    const [isFactura, setIsFactura]   = useState(false);

    const tabs = [
        { id: 'consultas',        label: 'Consultas' },
        { id: 'procedimientos',   label: 'Procedimientos' },
        { id: 'medicamentos',     label: 'Medicamentos' },
        { id: 'hospitalizaciones',label: 'Hospitalizaciones' },
        { id: 'urgencias',        label: 'Urgencias' },
        { id: 'otrosServicios',   label: 'Otros Servicios' },
    ];

    const buscarFactura = useCallback(async (userId = null, numOverride = null) => {
        const num = numOverride ?? numFactura;
        if (!num.trim()) return;
        try {
            setLoading(true);
            const result = await SearchBill(num, userId);
            if (!userId) setData(result);
            else setData(prev => ({ ...result, users: prev?.users || result.users || [] }));
            setSelectedUserId(userId);
            setIsFactura(true);
            showSuccess('Factura encontrada');
        } catch {
            showError('La factura no se encontró');
        } finally {
            setLoading(false);
        }
    }, [numFactura]);

    // Auto-buscar si viene el parámetro ?factura= en la URL
    useEffect(() => {
        const facturaParam = searchParams.get('factura');
        if (facturaParam) {
            setNumFactura(facturaParam);
            buscarFactura(null, facturaParam);
            setSearchParams({}, { replace: true });
        }
    }, []);

    return (
        <>
            <div className="mb-5">
                <h1 className="text-xl font-semibold text-[#111111] tracking-tight">Consulta RIPS</h1>
                <p className="mt-1 text-sm text-[#787774]">Busque información de facturas en el sistema.</p>
            </div>

            <div style={{ border: '1px solid #EAEAEA', borderRadius: 8, backgroundColor: '#fff' }} className="p-5 mb-3">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-600 mb-2">Búsqueda por número de factura</label>
                        <input
                            type="text"
                            value={numFactura}
                            onChange={e => setNumFactura(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && buscarFactura()}
                            placeholder="Ej: 100245 o FAC-001"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                        />
                    </div>
                    <button
                        onClick={() => buscarFactura()}
                        disabled={loading}
                        className="cursor-pointer px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                        <Search className="inline-block w-5 h-5 -mt-1" />
                    </button>
                </div>
            </div>

            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                    <p className="mt-4 text-slate-500">Cargando información...</p>
                </div>
            )}

            {isFactura && (
                <div className="flex justify-end p-4 bg-slate-50 border-t border-slate-200">
                    <button onClick={() => exportFacturaToExcel(data)} className="cursor-pointer px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-green-700 transition">
                        Exportar a Excel
                    </button>
                </div>
            )}

            {data?.users?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 mb-6">
                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Seleccionar usuario</h3>
                    <Select
                        options={data.users.map(u => ({ value: u.id, label: `${u.tipo_doc} ${u.num_doc}` }))}
                        value={selectedUserId}
                        onChange={e => buscarFactura(e.value)}
                        placeholder="Seleccione un usuario"
                        classNamePrefix="react-select"
                        styles={{
                            control: base => ({ ...base, borderRadius: 12, borderColor: '#CBD5E1', boxShadow: 'none', padding: '2px 4px' }),
                            menu: base => ({ ...base, borderRadius: 12 }),
                        }}
                    />
                </div>
            )}

            {data && !data.pendingUserSelection && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                    <div className="bg-blue-600 p-4">
                        <h3 className="text-xl font-semibold text-white">Información de la Factura</h3>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50">
                        {[
                            { label: 'Número de Factura', value: data.transaccion?.num_factura },
                            { label: 'NIT', value: data.transaccion?.num_nit },
                            { label: 'Prestador', value: data.control?.Prestador?.nombre_prestador || 'N/A' },
                            { label: 'Periodo', value: `${data.control?.periodo_fac}/${data.control?.año}` },
                            { label: 'Estado', value: data.control?.status },
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
                                <p className="text-xs uppercase font-medium text-slate-500">{item.label}</p>
                                <p className="mt-1 text-sm font-semibold text-slate-800">{item.value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-slate-200 bg-white">
                        <nav className="flex overflow-x-auto gap-6 px-6 bg-slate-50">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`cursor-pointer py-3 text-sm font-medium border-b-2 transition-all ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                                >
                                    {tab.label}
                                    {data[tab.id]?.length > 0 && (
                                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{data[tab.id].length}</span>
                                    )}
                                </button>
                            ))}
                        </nav>
                        <div className="p-6">
                            {tabs.map(tab => (
                                <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'}>
                                    <RenderTabla datos={data[tab.id]} tabId={tab.id} titulo={tab.label} visibleColsByTab={visibleColsByTab} setVisibleColsByTab={setVisibleColsByTab} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Pill({ n, label, color }) {
    if (!n || Number(n) === 0) return null;
    return (
        <span style={{ backgroundColor: color + '18', color, borderRadius: 6, padding: '2px 7px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
            {Number(n)} {label}
        </span>
    );
}

const TIPOS = [
    { key: 'num_usuarios',         label: 'Usuarios',          color: '#7C3AED' },
    { key: 'num_consultas',        label: 'Consultas',         color: '#1F6C9F' },
    { key: 'num_procedimientos',   label: 'Procedimientos',    color: '#0891B2' },
    { key: 'num_medicamentos',     label: 'Medicamentos',      color: '#15803D' },
    { key: 'num_hospitalizaciones',label: 'Hospitalizaciones', color: '#B45309' },
    { key: 'num_urgencias',        label: 'Urgencias',         color: '#B91C1C' },
    { key: 'num_otros',            label: 'Otros',             color: '#6B7280' },
];

function RegistroCard({ r, onDescargar }) {
    const [open, setOpen] = useState(false);

    const fecha = new Date(r.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: '2-digit' });
    const valor = r.valor_factura != null
        ? `$${Number(r.valor_factura).toLocaleString('es-CO')}`
        : '—';

    const archivos = [
        { tipo: 'RIP', file: r.archivos?.rip, icon: FileJson,  color: '#1F6C9F' },
        { tipo: 'CUV', file: r.archivos?.cuv, icon: FileText,  color: '#15803D' },
        { tipo: 'XML', file: r.archivos?.xml, icon: FileCode,  color: '#B45309' },
    ];

    return (
        <div style={{ border: '1px solid #EAEAEA', borderRadius: 10, backgroundColor: '#fff', overflow: 'hidden' }}>
            {/* Cabecera siempre visible */}
            <button
                onClick={() => setOpen(v => !v)}
                style={{ width: '100%', textAlign: 'left', padding: '14px 18px', cursor: 'pointer', background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: '#111111' }}>{r.numero_radicado || '—'}</span>
                        <span style={{ fontSize: 12, color: '#787774' }}>{fecha}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#787774', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {r.nombre_prestador || '—'} · Factura <span style={{ fontWeight: 600, color: '#111111' }}>{r.num_factura}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#111111' }}>{valor}</span>
                    {open ? <ChevronUp style={{ width: 16, height: 16, color: '#787774' }} /> : <ChevronDown style={{ width: 16, height: 16, color: '#787774' }} />}
                </div>
            </button>

            {/* Detalle desplegable */}
            {open && (
                <div style={{ borderTop: '1px solid #F0F0EF', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Info grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
                        {[
                            { label: 'Período',     value: `${r.periodo_fac}/${r['año'] ?? r.año}` },
                            { label: 'NIT',         value: r.num_nit },
                            { label: 'Prestador',   value: r.nombre_prestador },
                            { label: 'Valor',       value: valor },
                        ].map((item, i) => (
                            <div key={i} style={{ backgroundColor: '#F9F9F8', borderRadius: 8, padding: '8px 12px' }}>
                                <p style={{ fontSize: 10, fontWeight: 600, color: '#787774', textTransform: 'uppercase', marginBottom: 2 }}>{item.label}</p>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#111111' }}>{item.value || '—'}</p>
                            </div>
                        ))}
                    </div>

                    {/* Resumen RIP */}
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 600, color: '#787774', textTransform: 'uppercase', marginBottom: 6 }}>Resumen RIP</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {TIPOS.map(t => <Pill key={t.key} n={r[t.key]} label={t.label} color={t.color} />)}
                            {TIPOS.every(t => !r[t.key] || Number(r[t.key]) === 0) && (
                                <span style={{ fontSize: 12, color: '#787774', fontStyle: 'italic' }}>Sin datos de servicios</span>
                            )}
                        </div>
                    </div>

                    {/* Descargas */}
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 600, color: '#787774', textTransform: 'uppercase', marginBottom: 6 }}>Archivos</p>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {archivos.map(({ tipo, file, icon: Icon, color }) => (
                                file ? (
                                    <button
                                        key={tipo}
                                        onClick={() => onDescargar(r.control_id, file)}
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

// ─── Componente vista USER (mis registros) ────────────────────────────────────
const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function MisRegistros() {
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading]    = useState(true);
    const [error, setError]        = useState(null);

    // Filtros
    const [busqueda,   setBusqueda]   = useState('');  // factura o radicado
    const [fechaDesde, setFechaDesde] = useState('');  // fecha subida desde
    const [fechaHasta, setFechaHasta] = useState('');  // fecha subida hasta
    const [periodo,    setPeriodo]    = useState('');  // "MM/YYYY"

    const cargar = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiFetch('/api/auth/mis-registros');
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || 'Error');
            setRegistros(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    // Filtrado client-side
    const filtrados = registros.filter(r => {
        if (busqueda.trim()) {
            const q = busqueda.trim().toLowerCase();
            const enFactura  = String(r.num_factura  || '').toLowerCase().includes(q);
            const enRadicado = String(r.numero_radicado || '').toLowerCase().includes(q);
            if (!enFactura && !enRadicado) return false;
        }
        if (fechaDesde) {
            if (new Date(r.fecha) < new Date(fechaDesde)) return false;
        }
        if (fechaHasta) {
            const hasta = new Date(fechaHasta);
            hasta.setHours(23, 59, 59, 999);
            if (new Date(r.fecha) > hasta) return false;
        }
        if (periodo.trim()) {
            // Busca "MM/YYYY" o "MM" o "YYYY"
            const q = periodo.trim();
            const mm   = String(r.periodo_fac || '').padStart(2, '0');
            const yyyy = String(r['año'] ?? r.año ?? '');
            const label = `${mm}/${yyyy}`;
            if (!label.includes(q)) return false;
        }
        return true;
    });

    const hayFiltros = busqueda || fechaDesde || fechaHasta || periodo;

    const limpiar = () => {
        setBusqueda(''); setFechaDesde(''); setFechaHasta(''); setPeriodo('');
    };

    const handleDescargar = async (controlId, filename) => {
        try {
            const res = await apiFetch(`/api/auth/descargar-archivo?controlId=${controlId}&filename=${encodeURIComponent(filename)}`);
            if (!res.ok) { showError('No se pudo descargar el archivo'); return; }
            const blob = await res.blob();
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href     = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            showError('Error al descargar');
        }
    };

    return (
        <>
            <div className="mb-5 flex items-end justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-[#111111] tracking-tight">Mis registros</h1>
                    <p className="mt-1 text-sm text-[#787774]">Facturas que has subido al sistema.</p>
                </div>
                <button
                    onClick={cargar}
                    disabled={loading}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid #EAEAEA', backgroundColor: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, color: '#111111' }}
                >
                    {loading ? <Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> : null}
                    Actualizar
                </button>
            </div>

            {/* Panel de filtros */}
            <div style={{ border: '1px solid #EAEAEA', borderRadius: 10, backgroundColor: '#fff', padding: '14px 18px', marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
                {/* Factura / Radicado */}
                <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#787774', textTransform: 'uppercase', marginBottom: 4 }}>Factura / Radicado</label>
                    <input
                        type="text"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        placeholder="Buscar..."
                        style={{ width: '100%', padding: '6px 10px', borderRadius: 7, border: '1px solid #D1D5DB', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>

                {/* Fecha subida desde */}
                <div style={{ flex: '1 1 140px', minWidth: 0 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#787774', textTransform: 'uppercase', marginBottom: 4 }}>Fecha subida desde</label>
                    <input
                        type="date"
                        value={fechaDesde}
                        onChange={e => setFechaDesde(e.target.value)}
                        style={{ width: '100%', padding: '6px 10px', borderRadius: 7, border: '1px solid #D1D5DB', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>

                {/* Fecha subida hasta */}
                <div style={{ flex: '1 1 140px', minWidth: 0 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#787774', textTransform: 'uppercase', marginBottom: 4 }}>Hasta</label>
                    <input
                        type="date"
                        value={fechaHasta}
                        onChange={e => setFechaHasta(e.target.value)}
                        style={{ width: '100%', padding: '6px 10px', borderRadius: 7, border: '1px solid #D1D5DB', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>

                {/* Período facturado */}
                <div style={{ flex: '1 1 120px', minWidth: 0 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#787774', textTransform: 'uppercase', marginBottom: 4 }}>Período facturado</label>
                    <input
                        type="text"
                        value={periodo}
                        onChange={e => setPeriodo(e.target.value)}
                        placeholder="MM/YYYY"
                        style={{ width: '100%', padding: '6px 10px', borderRadius: 7, border: '1px solid #D1D5DB', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>

                {hayFiltros && (
                    <button
                        onClick={limpiar}
                        style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid #EAEAEA', backgroundColor: '#F9F9F8', fontSize: 12, fontWeight: 600, color: '#787774', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                        Limpiar
                    </button>
                )}
            </div>

            {loading && (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <Loader2 style={{ width: 32, height: 32, color: '#1F6C9F', margin: '0 auto' }} className="animate-spin" />
                    <p style={{ marginTop: 12, fontSize: 14, color: '#787774' }}>Cargando registros...</p>
                </div>
            )}

            {error && !loading && (
                <div style={{ border: '1px solid #FECACA', borderRadius: 10, backgroundColor: '#FEF2F2', padding: '14px 18px' }}>
                    <p style={{ fontSize: 13, color: '#B91C1C', fontWeight: 600 }}>Error al cargar: {error}</p>
                </div>
            )}

            {!loading && !error && registros.length === 0 && (
                <div style={{ border: '1px solid #EAEAEA', borderRadius: 10, backgroundColor: '#F9F9F8', padding: '48px 0', textAlign: 'center' }}>
                    <p style={{ fontSize: 14, color: '#787774' }}>Aún no has subido ninguna factura.</p>
                </div>
            )}

            {!loading && !error && registros.length > 0 && filtrados.length === 0 && (
                <div style={{ border: '1px solid #EAEAEA', borderRadius: 10, backgroundColor: '#F9F9F8', padding: '32px 0', textAlign: 'center' }}>
                    <p style={{ fontSize: 14, color: '#787774' }}>Ningún registro coincide con los filtros.</p>
                </div>
            )}

            {!loading && filtrados.length > 0 && (
                <>
                    <p style={{ fontSize: 12, color: '#787774', marginBottom: 8 }}>
                        {hayFiltros ? `${filtrados.length} de ${registros.length} registros` : `${registros.length} registros`}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {filtrados.map(r => (
                            <RegistroCard key={r.control_id} r={r} onDescargar={handleDescargar} />
                        ))}
                    </div>
                </>
            )}
        </>
    );
}

// ─── Entry point ──────────────────────────────────────────────────────────────
export default function Consultar() {
    const admin = isAdmin();
    return (
        <div className="fade-up fade-up-1">
            {admin ? <ConsultarAdmin /> : <MisRegistros />}
        </div>
    );
}
