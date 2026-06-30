import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Upload, FileJson, FileCode, CheckCircle2, AlertCircle, XCircle, Loader2, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { consultarCUV } from '../services/searchBill.js';
import { apiFetch } from '../lib/api.js';
import { monthOptions, yearsOptions } from '../data/facturedDateOptions.js';
import Select from 'react-select';
import { toast } from 'react-toastify';

// ─── Parsers ────────────────────────────────────────────────────────────────

function extractCuvFromText(text) {
    try {
        const json = JSON.parse(text);
        return (
            json.CodigoUnicoValidacion ||
            json.codigoUnicoValidacion ||
            json['Código Unico de Validación (CUV)'] ||
            json['Codigo Unico de Validacion (CUV)'] ||
            json['CUV'] ||
            null
        );
    } catch {
        const patterns = [
            /["']?CodigoUnicoValidacion["']?\s*:\s*["']([^"']+)["']/i,
            /["']?Código\s+Unico\s+de\s+Validación\s*\(CUV\)["']?\s*:\s*["']([^"']+)["']/i,
            /["']?Codigo\s+Unico\s+de\s+Validacion\s*\(CUV\)["']?\s*:\s*["']([^"']+)["']/i,
            /["']?CUV["']?\s*:\s*["']([^"']+)["']/i,
            /Código\s+Unico\s+de\s+Validación\s*\(CUV\)\s*:\s*([a-fA-F0-9]+)/i,
            /Codigo\s+Unico\s+de\s+Validacion\s*\(CUV\)\s*:\s*([a-fA-F0-9]+)/i,
            /CodigoUnicoValidacion\s*:\s*([a-fA-F0-9]+)/i,
            /CUV\s*:\s*([a-fA-F0-9]+)/i,
        ];
        for (const p of patterns) {
            const m = text.match(p);
            if (m?.[1]) return m[1].trim();
        }
        return null;
    }
}

function extractFacturaFromCuv(text) {
    try {
        const json = JSON.parse(text);
        return (
            json.Factura ||
            json.factura ||
            json.NumFactura ||
            json.numFactura ||
            json.numeroFactura ||
            json.NumeroFactura ||
            null
        );
    } catch {
        const patterns = [
            /["']?(?:Factura|NumFactura|numFactura|numeroFactura|NumeroFactura)["']?\s*:\s*["']?([^"',\s]+)["']?/i,
        ];
        for (const p of patterns) {
            const m = text.match(p);
            if (m?.[1]) return m[1].trim();
        }
        return null;
    }
}

function extractFromRip(text) {
    try {
        const json = JSON.parse(text);

        const contarServicios = (nombre) => {
            let total = 0;
            if (Array.isArray(json[nombre])) total += json[nombre].length;
            const usuarios = json.usuarios || json.Usuarios || json.users || json.afiliados || [];
            if (Array.isArray(usuarios)) {
                usuarios.forEach(u => {
                    const arr = (u.Servicios || u.servicios || {})[nombre];
                    if (Array.isArray(arr)) total += arr.length;
                });
            }
            return total;
        };

        const usuariosArr = json.usuarios || json.Usuarios || json.users || json.afiliados || [];

        return {
            numFactura: json.numFactura || json.NumFactura || json.numeroFactura || null,
            nit: json.numDocumentoIdObligado || null,
            tipoNota: json.tipoNota || null,
            usuarios: Array.isArray(usuariosArr) ? usuariosArr.length : 0,
            consultas: contarServicios('consultas'),
            procedimientos: contarServicios('procedimientos'),
            hospitalizaciones: contarServicios('hospitalizaciones'),
            recienNacidos: contarServicios('recienNacidos') + contarServicios('recienNacido'),
            urgencias: contarServicios('urgencias'),
            medicamentos: contarServicios('medicamentos'),
            otrosServicios: contarServicios('otrosServicios'),
            _raw: json,
        };
    } catch {
        return { numFactura: null, nit: null, _raw: null };
    }
}

function extractFromXml(text) {
    // <cbc:ParentDocumentID>VALUE</cbc:ParentDocumentID>
    const parentMatch = text.match(/<[^:>]*:?ParentDocumentID[^>]*>([^<]+)<\/[^>]+>/i);
    const parentDocumentID = parentMatch?.[1]?.trim() || null;

    // <sts:QRCode>...NumFac=VALUE...</sts:QRCode>  (puede estar encoded)
    const qrMatch = text.match(/<[^:>]*:?QRCode[^>]*>([\s\S]*?)<\/[^>]+>/i);
    let qrNumFac = null;
    if (qrMatch?.[1]) {
        const qrContent = qrMatch[1].replace(/&amp;/g, '&');
        const numFacMatch = qrContent.match(/NumFac=([^&\s<]+)/i);
        qrNumFac = numFacMatch?.[1]?.trim() || null;
    }

    // <cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID="COP">VALUE</cbc:LineExtensionAmount>
    const lineExtMatch = text.match(/<[^:>]*:?LineExtensionAmount[^>]*>([^<]+)<\/[^:>]*:?LineExtensionAmount>/i);
    const lineExtensionAmount = lineExtMatch?.[1]?.trim() || null;

    return { parentDocumentID, qrNumFac, lineExtensionAmount };
}

// ─── Dropzone ────────────────────────────────────────────────────────────────

const ACCEPT = {
    cuv: '.json,.txt',
    rip: '.json',
    xml: '.xml',
};

const SLOT_META = {
    cuv: {
        label: 'Archivo CUV',
        sublabel: 'JSON o TXT con CodigoUnicoValidacion',
        icon: FileJson,
        color: '#346538',
        bg: '#EDF3EC',
        border: '#B7D9BA',
    },
    rip: {
        label: 'Archivo RIP',
        sublabel: 'JSON con la información RIPS',
        icon: FileJson,
        color: '#1F6C9F',
        bg: '#E1F3FE',
        border: '#A3D4F0',
    },
    xml: {
        label: 'Archivo XML',
        sublabel: 'Factura electrónica en XML',
        icon: FileCode,
        color: '#7C3AED',
        bg: '#F3EEFE',
        border: '#C4B5FD',
    },
};

function FileSlot({ slotKey, file, onFile, onClear }) {
    const meta = SLOT_META[slotKey];
    const Icon = meta.icon;
    const [dragging, setDragging] = useState(false);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) onFile(f);
    }, [onFile]);

    const handleChange = useCallback((e) => {
        const f = e.target.files?.[0];
        if (f) onFile(f);
        e.target.value = '';
    }, [onFile]);

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
                border: `2px dashed ${dragging ? meta.color : file ? meta.border : '#D1D5DB'}`,
                borderRadius: 12,
                backgroundColor: dragging ? meta.bg : file ? `${meta.bg}99` : '#FAFAFA',
                transition: 'all 180ms',
                padding: '20px 16px',
            }}
            className="flex flex-col gap-3"
        >
            <div className="flex items-center gap-3">
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon style={{ color: meta.color }} className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#111111]">{meta.label}</p>
                    <p className="text-xs text-[#787774] truncate">{meta.sublabel}</p>
                </div>
                {file ? (
                    <button onClick={onClear} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
                        <XCircle className="w-4 h-4" />
                    </button>
                ) : null}
            </div>

            {file ? (
                <div style={{ backgroundColor: meta.bg, borderRadius: 8, padding: '8px 12px' }} className="flex items-center gap-2">
                    <CheckCircle2 style={{ color: meta.color }} className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs font-medium truncate" style={{ color: meta.color }}>{file.name}</span>
                </div>
            ) : (
                <label style={{ cursor: 'pointer' }}>
                    <div style={{
                        border: `1px solid ${meta.border}`,
                        borderRadius: 8,
                        backgroundColor: '#ffffff',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        transition: 'background 150ms',
                    }}
                        className="hover:opacity-80"
                    >
                        <Upload className="w-3.5 h-3.5" style={{ color: meta.color }} />
                        <span className="text-xs font-medium" style={{ color: meta.color }}>Seleccionar archivo</span>
                    </div>
                    <input type="file" accept={ACCEPT[slotKey]} onChange={handleChange} className="hidden" />
                </label>
            )}
        </div>
    );
}

// ─── Chip de validación ───────────────────────────────────────────────────────

function MatchRow({ label, values, ok }) {
    return (
        <div className={`rounded-lg border px-4 py-3 ${ok ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-start gap-2">
                {ok
                    ? <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    : <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                }
                <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold mb-1 ${ok ? 'text-green-800' : 'text-red-800'}`}>{label}</p>
                    <div className="flex flex-wrap gap-1.5">
                        {values.map((v, i) => (
                            <span key={i} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono ${ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                                <span className="font-sans font-medium opacity-70">{v.src}:</span>
                                {v.val ?? <span className="italic opacity-60">no encontrado</span>}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Collapsible ─────────────────────────────────────────────────────────────

function Collapsible({ title, badge, badgeOk, defaultOpen = false, children }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div style={{ border: '1px solid #EAEAEA', borderRadius: 10, backgroundColor: '#ffffff', overflow: 'hidden' }}>
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left"
            >
                <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-[#787774] uppercase tracking-wide">{title}</p>
                    {badge !== undefined && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${badgeOk ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {badgeOk ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {badge}
                        </span>
                    )}
                </div>
                {open ? <ChevronUp className="w-4 h-4 text-[#787774]" /> : <ChevronDown className="w-4 h-4 text-[#787774]" />}
            </button>
            {open && <div className="px-4 pb-4">{children}</div>}
        </div>
    );
}

// ─── Página principal ─────────────────────────────────────────────────────────

const SELECT_STYLES = {
    container: (b) => ({ ...b, width: '100%' }),
    control: (b) => ({ ...b, borderRadius: 10, borderColor: '#CBD5E1', boxShadow: 'none', padding: '2px 4px' }),
    input: (b) => ({ ...b, color: 'inherit' }),
    menu: (b) => ({ ...b, borderRadius: 10 }),
};

export default function CargarFactura() {
    const [files, setFiles] = useState({ cuv: null, rip: null, xml: null });
    const [parsed, setParsed] = useState({ cuv: null, rip: null, xml: null });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadDone, setUploadDone] = useState(false);
    const [uploadModal, setUploadModal] = useState(null); // { radicado, fecha }
    const [result, setResult] = useState(null);

    // Período y prestador
    const [prestadores, setPrestadores] = useState([]);
    const [prestadorId, setPrestadorId] = useState('');
    const [periodoFac, setPeriodoFac] = useState('');
    const [anio, setAnio] = useState('');

    useEffect(() => {
        apiFetch('/api/auth/prestadores')
            .then(r => r.json())
            .then(data => setPrestadores(Array.isArray(data) ? data : []))
            .catch(() => {});
    }, []);

    const prestadorOptions = prestadores.map(p => ({
        value: String(p.id),
        label: `${p.id} - ${p.nombre}${p.nit ? ' • NIT: ' + p.nit : ''}${p.cod ? ' (' + p.cod + ')' : ''}`,
    }));
    const selectedPrestador = prestadorOptions.find(o => o.value === String(prestadorId)) || null;

    const allLoaded = files.cuv && files.rip && files.xml;

    const handleFile = useCallback(async (slot, file) => {
        const text = await file.text();
        let data = null;

        if (slot === 'cuv') {
            const cuv = extractCuvFromText(text);
            const factura = extractFacturaFromCuv(text);
            data = { cuv, factura, text };
            if (!cuv) {
                toast.error('No se encontró CodigoUnicoValidacion en el archivo CUV');
                return;
            }
        } else if (slot === 'rip') {
            data = extractFromRip(text);
        } else if (slot === 'xml') {
            data = extractFromXml(text);
        }

        setFiles(prev => ({ ...prev, [slot]: file }));
        setParsed(prev => ({ ...prev, [slot]: data }));
        setResult(null);
    }, []);

    const handleClear = useCallback((slot) => {
        setFiles(prev => ({ ...prev, [slot]: null }));
        setParsed(prev => ({ ...prev, [slot]: null }));
        setResult(null);
    }, []);

    const handleReset = () => {
        setFiles({ cuv: null, rip: null, xml: null });
        setParsed({ cuv: null, rip: null, xml: null });
        setResult(null);
    };

    const handleSubir = async () => {
        if (!prestadorId) return toast.error('Seleccione un prestador');
        if (!periodoFac) return toast.error('Seleccione el mes de facturación');
        if (!anio) return toast.error('Seleccione el año de facturación');

        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('rip', files.rip);
            fd.append('cuv', files.cuv);
            fd.append('xml', files.xml);
            fd.append('prestadorId', String(prestadorId));
            fd.append('periodo_fac', String(periodoFac));
            fd.append('anio', String(anio));
            // Valor: LineExtensionAmount del XML, fallback TotalFactura de la API del Ministerio
            const valorFactura = result?.xmlLineExt ?? result?.apiTotal ?? null;
            if (valorFactura != null) fd.append('valorFactura', String(valorFactura));

            const res = await apiFetch('/api/auth/upload-json-file', { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || 'Error en la carga');

            setUploadDone(true);
            setUploadModal({
                radicado: data.radicado || '—',
                fecha: new Date().toLocaleString('es-CO', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                }),
            });
        } catch (err) {
            toast.error(err.message || 'Error al subir');
        } finally {
            setUploading(false);
        }
    };

    const handleValidar = async () => {
        if (!allLoaded) return;
        setLoading(true);
        setResult(null);

        try {
            const cuvCode = parsed.cuv?.cuv;
            const apiData = await consultarCUV(cuvCode);

            const isValid = apiData.EsValido === true || apiData.ResultState === true;

            // Validación API: CodigoUnicoValidacion de la respuesta debe coincidir con el CUV del archivo
            const apiCuv = apiData.CodigoUnicoValidacion && apiData.CodigoUnicoValidacion !== '-'
                ? String(apiData.CodigoUnicoValidacion).trim()
                : null;
            const cuvMatch = apiCuv ? apiCuv === String(cuvCode).trim() : true; // si la API no devuelve CUV, no penalizar

            // Campos de número de factura de cada archivo
            const cuvFactura = parsed.cuv?.factura ? String(parsed.cuv.factura).trim() : null;
            const ripNumFactura = parsed.rip?.numFactura ? String(parsed.rip.numFactura).trim() : null;
            const xmlParentDoc = parsed.xml?.parentDocumentID ? String(parsed.xml.parentDocumentID).trim() : null;
            const xmlQrNumFac = parsed.xml?.qrNumFac ? String(parsed.xml.qrNumFac).trim() : null;

            // Normalizar quitando ceros a la izquierda
            const normalize = (v) => {
                if (!v) return null;
                const stripped = String(v).replace(/^0+/, '');
                return stripped || '0';
            };

            const nCuvFactura = normalize(cuvFactura);
            const nRip = normalize(ripNumFactura);
            const nXmlParent = normalize(xmlParentDoc);
            const nXmlQr = normalize(xmlQrNumFac);

            // Referencia: el valor que tienen en común (usamos el del CUV como ancla)
            const ref = nCuvFactura;

            const checks = {
                cuvVsRip: ref !== null && nRip !== null && nCuvFactura === nRip,
                cuvVsXmlParent: ref !== null && nXmlParent !== null && nCuvFactura === nXmlParent,
                cuvVsXmlQr: ref !== null && nXmlQr !== null && nCuvFactura === nXmlQr,
                ripVsXmlParent: nRip !== null && nXmlParent !== null && nRip === nXmlParent,
                ripVsXmlQr: nRip !== null && nXmlQr !== null && nRip === nXmlQr,
                xmlParentVsQr: nXmlParent !== null && nXmlQr !== null && nXmlParent === nXmlQr,
            };

            const allMatch = nCuvFactura !== null
                && nCuvFactura === nRip
                && nCuvFactura === nXmlParent
                && nCuvFactura === nXmlQr;

            // Validación de valor: TotalFactura API vs LineExtensionAmount XML
            const apiTotal = apiData.TotalFactura != null ? Number(apiData.TotalFactura) : null;
            const xmlLineExt = parsed.xml?.lineExtensionAmount != null
                ? Number(parsed.xml.lineExtensionAmount)
                : null;
            const valorMatch = apiTotal !== null && xmlLineExt !== null
                ? Math.abs(apiTotal - xmlLineExt) < 0.01
                : null; // null = no se puede comparar (falta alguno)

            setResult({
                apiData, isValid, cuvMatch, cuvCode, apiCuv,
                cuvFactura, ripNumFactura, xmlParentDoc, xmlQrNumFac,
                checks, allMatch,
                apiTotal, xmlLineExt, valorMatch,
            });

            if (!isValid) {
                toast.warning('El CUV no es válido según el Ministerio');
            } else if (!cuvMatch) {
                toast.error('El CUV de la respuesta no coincide con el archivo CUV');
            } else if (allMatch) {
                toast.success('✓ Los tres archivos corresponden a la misma factura');
            } else {
                toast.error('Los archivos no corresponden a la misma factura');
            }
        } catch (err) {
            toast.error(err.message || 'Error al validar');
            setResult({ error: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-up fade-up-1">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-[#111111] tracking-tight">Cargar Factura</h1>
                    <p className="mt-1 text-sm text-[#787774]">
                        Completa la información, sube los archivos y valida antes de subir al sistema.
                    </p>
                </div>
                {(files.cuv || files.rip || files.xml || result) && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#111111] transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Limpiar
                    </button>
                )}
            </div>

            {/* 1 — Prestador + Período */}
            <div style={{ border: '1px solid #EAEAEA', borderRadius: 8, backgroundColor: '#ffffff' }} className="p-4 mb-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prestador</label>
                    <Select
                        options={prestadorOptions}
                        value={selectedPrestador}
                        onChange={opt => setPrestadorId(opt ? opt.value : '')}
                        isClearable
                        placeholder="Buscar y seleccionar prestador..."
                        classNamePrefix="react-select"
                        styles={SELECT_STYLES}
                    />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Período de facturación</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Mes</label>
                            <Select
                                options={monthOptions}
                                value={monthOptions.find(o => o.value === Number(periodoFac)) || null}
                                onChange={s => setPeriodoFac(s ? s.value : '')}
                                placeholder="Seleccionar mes"
                                isClearable
                                classNamePrefix="react-select"
                                styles={SELECT_STYLES}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Año</label>
                            <Select
                                options={yearsOptions}
                                value={yearsOptions.find(o => o.value === Number(anio)) || null}
                                onChange={s => setAnio(s ? s.value : '')}
                                placeholder="Seleccionar año"
                                isClearable
                                classNamePrefix="react-select"
                                styles={SELECT_STYLES}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2 — Dropzones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <FileSlot slotKey="cuv" file={files.cuv} onFile={(f) => handleFile('cuv', f)} onClear={() => handleClear('cuv')} />
                <FileSlot slotKey="rip" file={files.rip} onFile={(f) => handleFile('rip', f)} onClear={() => handleClear('rip')} />
                <FileSlot slotKey="xml" file={files.xml} onFile={(f) => handleFile('xml', f)} onClear={() => handleClear('xml')} />
            </div>

            {/* 3 — Vista previa RIP (aparece en cuanto se carga el archivo) */}
            {parsed.rip?.numFactura && (
                <div style={{ border: '1px solid #EAEAEA', borderRadius: 8, backgroundColor: '#F9F9F8' }} className="p-4 mb-4">
                    <p className="text-xs font-semibold text-[#787774] uppercase tracking-wide mb-3">Vista previa — RIP</p>
                    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 text-xs">
                        {Object.entries({
                            NIT: parsed.rip.nit,
                            Factura: parsed.rip.numFactura,
                            'Tipo nota': parsed.rip.tipoNota,
                            Usuarios: parsed.rip.usuarios,
                            Consultas: parsed.rip.consultas,
                            Procedimientos: parsed.rip.procedimientos,
                            Hospitalizaciones: parsed.rip.hospitalizaciones,
                            'Recién nacidos': parsed.rip.recienNacidos,
                            Urgencias: parsed.rip.urgencias,
                            Medicamentos: parsed.rip.medicamentos,
                            'Otros servicios': parsed.rip.otrosServicios,
                        }).map(([k, v]) => (
                            <div key={k}>
                                <dt className="text-slate-500 capitalize">{k}</dt>
                                <dd className="font-semibold text-slate-800">{v ?? '—'}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            )}

            {/* 4 — Botón validar (solo cuando aún no hay resultado) */}
            {!result && (
                <button
                    onClick={handleValidar}
                    disabled={!allLoaded || loading}
                    style={{
                        backgroundColor: allLoaded && !loading ? '#346538' : undefined,
                        borderRadius: 10,
                    }}
                    className="w-full py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors hover:opacity-90 mb-4"
                >
                    {loading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Validando con el Ministerio...</>
                        : <>Validar Factura</>
                    }
                </button>
            )}

            {/* Resultados */}
            {result && !result.error && (
                <div className="space-y-3">
                    {/* Banner principal */}
                    <div style={{
                        borderRadius: 10,
                        border: `2px solid ${result.isValid && result.allMatch ? '#B7D9BA' : '#FECACA'}`,
                        backgroundColor: result.isValid && result.allMatch ? '#EDF3EC' : '#FEF2F2',
                        padding: '16px 20px',
                    }} className="flex items-start gap-3">
                        {result.isValid && result.allMatch
                            ? <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            : <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        }
                        <div>
                            <p className={`text-sm font-semibold ${result.isValid && result.allMatch ? 'text-green-800' : 'text-red-800'}`}>
                                {!result.isValid
                                    ? 'CUV rechazado por el Ministerio'
                                    : result.allMatch
                                        ? 'Los tres archivos corresponden a la misma factura'
                                        : 'Los archivos no corresponden a la misma factura'
                                }
                            </p>
                            <p className={`text-xs mt-0.5 ${result.isValid && result.allMatch ? 'text-green-700' : 'text-red-600'}`}>
                                Número de factura referencia (CUV): <span className="font-mono font-semibold">{result.cuvFactura || 'no encontrado'}</span>
                            </p>
                        </div>
                    </div>

                    {/* Validación CUV Ministerio */}
                    <Collapsible
                        title="Validación CUV — Ministerio de Salud"
                        badge={result.cuvMatch ? 'CUV coincide' : 'CUV no coincide'}
                        badgeOk={result.cuvMatch}
                        defaultOpen={!result.cuvMatch}
                    >
                        <MatchRow
                            label="CodigoUnicoValidacion de la respuesta coincide con el CUV del archivo"
                            values={[
                                { src: 'Archivo CUV', val: result.cuvCode },
                                { src: 'Respuesta API', val: result.apiCuv ?? '(no retornado)' },
                            ]}
                            ok={result.cuvMatch}
                        />
                    </Collapsible>

                    {/* Verificación cruzada número de factura */}
                    <Collapsible
                        title="Verificación cruzada — Número de factura"
                        badge={result.allMatch ? '3/3 coinciden' : 'No coinciden'}
                        badgeOk={result.allMatch}
                        defaultOpen={!result.allMatch}
                    >
                        <div className="space-y-2">
                            <MatchRow
                                label="Factura (CUV) = numFactura (RIP)"
                                values={[
                                    { src: 'CUV · Factura', val: result.cuvFactura },
                                    { src: 'RIP · numFactura', val: result.ripNumFactura },
                                ]}
                                ok={result.checks.cuvVsRip}
                            />
                            <MatchRow
                                label="Factura (CUV) = ParentDocumentID (XML)"
                                values={[
                                    { src: 'CUV · Factura', val: result.cuvFactura },
                                    { src: 'XML · ParentDocumentID', val: result.xmlParentDoc },
                                ]}
                                ok={result.checks.cuvVsXmlParent}
                            />
                            <MatchRow
                                label="Factura (CUV) = QRCode NumFac (XML)"
                                values={[
                                    { src: 'CUV · Factura', val: result.cuvFactura },
                                    { src: 'XML · QRCode NumFac', val: result.xmlQrNumFac },
                                ]}
                                ok={result.checks.cuvVsXmlQr}
                            />
                        </div>
                    </Collapsible>

                    {/* Validación de valor */}
                    <Collapsible
                        title="Validación de valor — TotalFactura vs XML"
                        badge={
                            result.valorMatch === null ? 'Sin datos'
                            : result.valorMatch ? 'Valores coinciden'
                            : 'Valores no coinciden'
                        }
                        badgeOk={result.valorMatch === true}
                        defaultOpen={result.valorMatch !== true}
                    >
                        {result.valorMatch === null ? (
                            <p className="text-xs text-slate-500 italic">
                                No se pudo comparar: falta TotalFactura en la respuesta del Ministerio o LineExtensionAmount en el XML.
                            </p>
                        ) : (
                            <MatchRow
                                label="TotalFactura (Ministerio) = LineExtensionAmount (XML)"
                                values={[
                                    { src: 'API · TotalFactura', val: result.apiTotal != null ? `$${Number(result.apiTotal).toLocaleString('es-CO')}` : null },
                                    { src: 'XML · LineExtensionAmount', val: result.xmlLineExt != null ? `$${Number(result.xmlLineExt).toLocaleString('es-CO')}` : null },
                                ]}
                                ok={result.valorMatch}
                            />
                        )}
                    </Collapsible>

                    {/* Detalle API CUV */}
                    {(() => {
                        const esValido = result.apiData.EsValido === true || result.apiData.ResultState === true;
                        const tieneErrores = result.apiData.ResultadosValidacion?.length > 0;
                        return (
                            <Collapsible
                                title="Respuesta Ministerio"
                                badge={esValido ? 'Válido' : 'Rechazado'}
                                badgeOk={esValido}
                                defaultOpen={!esValido}
                            >
                                <table className="w-full text-xs mb-3">
                                    <tbody className="divide-y divide-slate-100">
                                        <tr className="hover:bg-slate-50">
                                            <td className="py-2 px-3 font-semibold text-slate-500 bg-slate-50 w-1/3 rounded-tl-lg">Estado</td>
                                            <td className="py-2 px-3">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${esValido ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {esValido ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                    {esValido ? 'Válido' : 'Rechazado'}
                                                </span>
                                            </td>
                                        </tr>
                                        {[
                                            ['CodigoUnicoValidacion', result.apiData.CodigoUnicoValidacion || result.apiData.CodigoUnicoValidacionToShow],
                                            ['ProcesoId', result.apiData.ProcesoId],
                                            ['Total Factura', result.apiData.TotalFactura != null ? `$${Number(result.apiData.TotalFactura).toLocaleString('es-CO')}` : null],
                                            ['Prestador', result.apiData.CodigoPrestador],
                                            ['Usuarios', result.apiData.CantidadUsuarios],
                                            ['Atenciones', result.apiData.CantidadAtenciones],
                                        ].map(([k, v]) => (
                                            <tr key={k} className="hover:bg-slate-50">
                                                <td className="py-2 px-3 font-semibold text-slate-500 bg-slate-50">{k}</td>
                                                <td className="py-2 px-3 font-mono text-slate-800">{v ?? '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {tieneErrores && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <p className="text-xs font-semibold text-red-800 mb-2 flex items-center gap-1.5">
                                            <AlertCircle className="w-3.5 h-3.5" /> Errores de validación
                                        </p>
                                        <div className="space-y-1.5">
                                            {result.apiData.ResultadosValidacion.map((v, i) => (
                                                <div key={i} className="bg-white rounded p-2 border border-red-200 text-xs">
                                                    <div className="flex gap-1.5 mb-0.5">
                                                        <span className="px-1.5 py-0.5 rounded font-semibold bg-red-100 text-red-800">{v.Clase}</span>
                                                        <span className="px-1.5 py-0.5 rounded font-semibold bg-slate-100 text-slate-700">{v.Codigo}</span>
                                                    </div>
                                                    <p className="font-medium text-slate-800">{v.Descripcion}</p>
                                                    {v.Observaciones && <p className="text-red-700 mt-0.5"><span className="font-semibold">Obs:</span> {v.Observaciones}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Collapsible>
                        );
                    })()}

                    {/* Subir al sistema */}
                    {result.isValid && result.allMatch && (
                        <button
                            onClick={handleSubir}
                            disabled={uploading || uploadDone}
                            style={{
                                borderRadius: 10,
                                cursor: uploading || uploadDone ? 'not-allowed' : 'pointer',
                                backgroundColor: uploadDone ? '#166534' : uploading ? '#374151' : '#1F6C9F',
                                transition: 'background-color 400ms',
                            }}
                            className="w-full py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90"
                        >
                            {uploading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Subiendo al sistema...</>
                            ) : uploadDone ? (
                                <><CheckCircle2 className="w-4 h-4" /> Factura subida</>
                            ) : (
                                <>Subir al sistema</>
                            )}
                        </button>
                    )}

                    {/* Volver a cargar */}
                    <button
                        onClick={handleReset}
                        className="w-full py-2.5 text-sm font-medium text-[#787774] hover:text-[#111111] hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Cargar otra factura
                    </button>
                </div>
            )}

            {result?.error && (
                <div style={{ border: '1px solid #FECACA', borderRadius: 10, backgroundColor: '#FEF2F2' }} className="p-4 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-red-800">Error al validar</p>
                        <p className="text-xs text-red-600 mt-0.5">{result.error}</p>
                    </div>
                </div>
            )}

            {/* Modal de éxito — renderizado en document.body vía portal */}
            {uploadModal && createPortal(
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: 16,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                    onClick={() => setUploadModal(null)}
                >
                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 16,
                            padding: '32px 28px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                            width: '100%',
                            maxWidth: 360,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 20,
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle2 style={{ width: 32, height: 32, color: '#16a34a' }} />
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: 15, fontWeight: 600, color: '#111111', marginBottom: 4 }}>Factura subida correctamente</p>
                            <p style={{ fontSize: 13, color: '#787774' }}>La factura ha sido registrada en el sistema.</p>
                        </div>

                        <div style={{ backgroundColor: '#F9F9F8', borderRadius: 10, padding: '14px 18px', width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
                                <span style={{ color: '#787774', fontWeight: 500, flexShrink: 0 }}>Radicado</span>
                                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#111111', textAlign: 'right' }}>{uploadModal.radicado}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
                                <span style={{ color: '#787774', fontWeight: 500, flexShrink: 0 }}>Fecha</span>
                                <span style={{ fontWeight: 500, color: '#111111', textAlign: 'right' }}>{uploadModal.fecha}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setUploadModal(null)}
                            style={{ borderRadius: 10, backgroundColor: '#166534', cursor: 'pointer', width: '100%', padding: '10px 0', fontSize: 14, fontWeight: 600, color: '#ffffff', border: 'none' }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
