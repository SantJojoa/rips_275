import { useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Upload, FileJson, FileCode, CheckCircle2, AlertCircle, XCircle, Loader2, RotateCcw, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
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

    // <cbc:ID>VALUE</cbc:ID>  (ID raíz del documento, último fallback)
    const idMatch = text.match(/<[^:>]*:?ID(?:\s[^>]*)?>([^<]+)<\/[^:>]*:?ID>/i);
    const documentID = idMatch?.[1]?.trim() || null;

    // <cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID="COP">VALUE</cbc:LineExtensionAmount>
    const lineExtMatch = text.match(/<[^:>]*:?LineExtensionAmount[^>]*>([^<]+)<\/[^:>]*:?LineExtensionAmount>/i);
    const lineExtensionAmount = lineExtMatch?.[1]?.trim() || null;

    // Referencia de factura del XML: QRCode NumFac > ParentDocumentID > ID (fallback si el anterior no está presente)
    let facturaRef = null;
    let facturaRefSource = null;
    if (qrNumFac) {
        facturaRef = qrNumFac;
        facturaRefSource = 'QRCode NumFac';
    } else if (parentDocumentID) {
        facturaRef = parentDocumentID;
        facturaRefSource = 'ParentDocumentID';
    } else if (documentID) {
        facturaRef = documentID;
        facturaRefSource = 'ID';
    }

    return { parentDocumentID, qrNumFac, documentID, lineExtensionAmount, facturaRef, facturaRefSource };
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

// ─── Tarjeta de una factura individual ────────────────────────────────────────

function InvoiceItemCard({ index, item, canRemove, onFile, onClear, onValidar, onSubir, onRemove }) {
    const { files, parsed, loading, uploading, uploaded, uploadInfo, result } = item;
    const allLoaded = files.cuv && files.rip && files.xml;

    if (uploaded) {
        return (
            <div style={{ border: '1px solid #B7D9BA', borderRadius: 10, backgroundColor: '#EDF3EC' }} className="p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-green-800">
                        Factura {parsed.rip?.numFactura || uploadInfo?.numFactura} subida correctamente
                    </p>
                    <p className="text-xs text-green-700 mt-0.5">
                        Radicado: <span className="font-mono font-semibold">{uploadInfo?.radicado}</span>
                        {uploadInfo?.reused ? ' · anexada a la cuenta existente' : ' · cuenta nueva'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ border: '1px solid #EAEAEA', borderRadius: 10, backgroundColor: '#ffffff' }} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#111111]">Factura #{index + 1}</p>
                {canRemove && (
                    <button
                        onClick={onRemove}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors"
                        title="Quitar esta factura"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Dropzones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FileSlot slotKey="cuv" file={files.cuv} onFile={(f) => onFile('cuv', f)} onClear={() => onClear('cuv')} />
                <FileSlot slotKey="rip" file={files.rip} onFile={(f) => onFile('rip', f)} onClear={() => onClear('rip')} />
                <FileSlot slotKey="xml" file={files.xml} onFile={(f) => onFile('xml', f)} onClear={() => onClear('xml')} />
            </div>

            {/* Vista previa RIP */}
            {parsed.rip?.numFactura && (
                <div style={{ border: '1px solid #EAEAEA', borderRadius: 8, backgroundColor: '#F9F9F8' }} className="p-4">
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

            {/* Botón validar */}
            {!result && (
                <button
                    onClick={onValidar}
                    disabled={!allLoaded || loading}
                    style={{
                        backgroundColor: allLoaded && !loading ? '#346538' : undefined,
                        borderRadius: 10,
                    }}
                    className="w-full py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors hover:opacity-90"
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
                                label={`Factura (CUV) = ${result.xmlFacturaRefSource || 'XML'} (XML)`}
                                values={[
                                    { src: 'CUV · Factura', val: result.cuvFactura },
                                    { src: `XML · ${result.xmlFacturaRefSource || 'sin dato'}`, val: result.xmlFacturaRef },
                                ]}
                                ok={result.checks.cuvVsXml}
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
                            onClick={onSubir}
                            disabled={uploading}
                            style={{
                                borderRadius: 10,
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                backgroundColor: uploading ? '#374151' : '#1F6C9F',
                                transition: 'background-color 400ms',
                            }}
                            className="w-full py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90"
                        >
                            {uploading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Subiendo al sistema...</>
                            ) : (
                                <>Subir esta factura</>
                            )}
                        </button>
                    )}
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

const MAX_CUV_INTENTOS = 3;

function emptyItem(id) {
    return {
        id,
        files: { cuv: null, rip: null, xml: null },
        parsed: { cuv: null, rip: null, xml: null },
        loading: false,
        uploading: false,
        uploaded: false,
        uploadInfo: null,
        result: null,
    };
}

export default function CargarFactura() {
    const nextId = useRef(1);
    const [items, setItems] = useState(() => [emptyItem(0)]);
    const [batchValidating, setBatchValidating] = useState(false);
    const [batchUploading, setBatchUploading] = useState(false);
    const [uploadModal, setUploadModal] = useState(null);
    const [modalLimiteCuv, setModalLimiteCuv] = useState(false);

    // Map CUV -> número de intentos de validación en esta sesión
    const cuvIntentos = useCallback(() => {
        if (!window.__cuvIntentos) window.__cuvIntentos = {};
        return window.__cuvIntentos;
    }, []);

    // Datos compartidos por todas las facturas de esta cuenta de cobro
    const [periodoFac, setPeriodoFac] = useState('');
    const [anio, setAnio] = useState(2026);
    const [numeroCuentaCobro, setNumeroCuentaCobro] = useState('');

    const getItem = useCallback((id) => items.find(it => it.id === id), [items]);
    const updateItem = useCallback((id, patch) => {
        setItems(prev => prev.map(it => it.id === id ? { ...it, ...(typeof patch === 'function' ? patch(it) : patch) } : it));
    }, []);

    const handleAddItem = () => {
        const id = nextId.current++;
        setItems(prev => [...prev, emptyItem(id)]);
    };

    const handleRemoveItem = (id) => {
        setItems(prev => prev.length > 1 ? prev.filter(it => it.id !== id) : prev);
    };

    const handleResetAll = () => {
        nextId.current = 1;
        setItems([emptyItem(0)]);
        setPeriodoFac('');
        setAnio(2026);
        setNumeroCuentaCobro('');
    };

    const handleFile = useCallback(async (id, slot, file) => {
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

        updateItem(id, it => ({
            files: { ...it.files, [slot]: file },
            parsed: { ...it.parsed, [slot]: data },
            result: null,
        }));
    }, [updateItem]);

    const handleClear = useCallback((id, slot) => {
        updateItem(id, it => ({
            files: { ...it.files, [slot]: null },
            parsed: { ...it.parsed, [slot]: null },
            result: null,
        }));
    }, [updateItem]);

    const handleValidarItem = async (id) => {
        const item = getItem(id);
        if (!item) return true;
        const { files, parsed } = item;
        const allLoaded = files.cuv && files.rip && files.xml;
        if (!allLoaded) return true;

        const cuvCode = parsed.cuv?.cuv;
        if (cuvCode) {
            const intentos = cuvIntentos();
            intentos[cuvCode] = (intentos[cuvCode] || 0) + 1;
            if (intentos[cuvCode] > MAX_CUV_INTENTOS) {
                setModalLimiteCuv(true);
                return false;
            }
        }

        updateItem(id, { loading: true, result: null });

        try {
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
            const xmlDocumentID = parsed.xml?.documentID ? String(parsed.xml.documentID).trim() : null;
            // Referencia de factura del XML con fallback: QRCode NumFac > ParentDocumentID > ID
            const xmlFacturaRef = parsed.xml?.facturaRef ? String(parsed.xml.facturaRef).trim() : null;
            const xmlFacturaRefSource = parsed.xml?.facturaRefSource || null;

            // Normalizar quitando ceros a la izquierda
            const normalize = (v) => {
                if (!v) return null;
                const stripped = String(v).replace(/^0+/, '');
                return stripped || '0';
            };

            const nCuvFactura = normalize(cuvFactura);
            const nRip = normalize(ripNumFactura);
            const nXmlRef = normalize(xmlFacturaRef);

            // Referencia: el valor que tienen en común (usamos el del CUV como ancla)
            const ref = nCuvFactura;

            const checks = {
                cuvVsRip: ref !== null && nRip !== null && nCuvFactura === nRip,
                cuvVsXml: ref !== null && nXmlRef !== null && nCuvFactura === nXmlRef,
                ripVsXml: nRip !== null && nXmlRef !== null && nRip === nXmlRef,
            };

            const allMatch = nCuvFactura !== null
                && nCuvFactura === nRip
                && nCuvFactura === nXmlRef;

            // Validación de valor: TotalFactura API vs LineExtensionAmount XML
            const apiTotal = apiData.TotalFactura != null ? Number(apiData.TotalFactura) : null;
            const xmlLineExt = parsed.xml?.lineExtensionAmount != null
                ? Number(parsed.xml.lineExtensionAmount)
                : null;
            const valorMatch = apiTotal !== null && xmlLineExt !== null
                ? Math.abs(apiTotal - xmlLineExt) < 0.01
                : null; // null = no se puede comparar (falta alguno)

            updateItem(id, {
                loading: false,
                result: {
                    apiData, isValid, cuvMatch, cuvCode, apiCuv,
                    cuvFactura, ripNumFactura, xmlParentDoc, xmlQrNumFac, xmlDocumentID,
                    xmlFacturaRef, xmlFacturaRefSource,
                    checks, allMatch,
                    apiTotal, xmlLineExt, valorMatch,
                },
            });

            if (!isValid) {
                toast.warning(`El CUV no es válido según el Ministerio (factura ${cuvFactura || ''})`);
            } else if (!cuvMatch) {
                toast.error('El CUV de la respuesta no coincide con el archivo CUV');
            } else if (allMatch) {
                toast.success(`✓ Factura ${cuvFactura || ''}: los tres archivos corresponden`);
            } else {
                toast.error(`Factura ${cuvFactura || ''}: los archivos no corresponden entre sí`);
            }
        } catch (err) {
            updateItem(id, { loading: false, result: { error: err.message } });
            toast.error(err.message || 'Error al validar');
        }
        return true;
    };

    const handleValidarTodas = async () => {
        const pendientes = items.filter(it => it.files.cuv && it.files.rip && it.files.xml && !it.result);
        if (pendientes.length === 0) return;
        setBatchValidating(true);
        for (const it of pendientes) {
            const seguir = await handleValidarItem(it.id);
            if (!seguir) break;
        }
        setBatchValidating(false);
    };

    const handleSubirItem = async (id) => {
        const item = getItem(id);
        if (!item || item.uploaded) return null;
        if (!periodoFac) { toast.error('Seleccione el mes de facturación'); return null; }
        if (!anio) { toast.error('Seleccione el año de facturación'); return null; }
        if (!numeroCuentaCobro.trim()) { toast.error('Ingrese el número de cuenta de cobro'); return null; }

        updateItem(id, { uploading: true });
        try {
            const fd = new FormData();
            fd.append('rip', item.files.rip);
            fd.append('cuv', item.files.cuv);
            fd.append('xml', item.files.xml);
            fd.append('periodo_fac', String(periodoFac));
            fd.append('anio', String(anio));
            fd.append('numero_cuenta_cobro', numeroCuentaCobro.trim());
            // Valor: LineExtensionAmount del XML, fallback TotalFactura de la API del Ministerio
            const valorFactura = item.result?.xmlLineExt ?? item.result?.apiTotal ?? null;
            if (valorFactura != null) fd.append('valorFactura', String(valorFactura));

            const res = await apiFetch('/api/auth/upload-json-file', { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok) {
                const msg = data?.message || 'Error en la carga';
                const esDuplicada = msg.toLowerCase().includes('duplic') || msg.toLowerCase().includes('ya exist') || res.status === 409;
                if (esDuplicada) {
                    toast.error(`Esta factura ya fue registrada en el sistema anteriormente (${item.result?.cuvFactura || ''}).`, { autoClose: 6000 });
                } else {
                    toast.error(msg);
                }
                return null;
            }

            const numFactura = item.parsed.rip?.numFactura || item.result?.cuvFactura || '—';
            updateItem(id, {
                uploading: false,
                uploaded: true,
                uploadInfo: { radicado: data.radicado || '—', reused: !!data.reused, numFactura },
            });
            return { radicado: data.radicado || '—', reused: !!data.reused, numFactura };
        } catch (err) {
            toast.error(err.message || 'Error al subir');
            return null;
        } finally {
            updateItem(id, { uploading: false });
        }
    };

    const handleSubirTodas = async () => {
        const validas = items.filter(it => it.result?.isValid && it.result?.allMatch && !it.uploaded);
        if (validas.length === 0) return;
        setBatchUploading(true);
        const subidas = [];
        for (const it of validas) {
            const info = await handleSubirItem(it.id);
            if (info) subidas.push(info);
        }
        setBatchUploading(false);

        if (subidas.length > 0) {
            setUploadModal({
                radicado: subidas[subidas.length - 1].radicado,
                facturas: subidas.map(s => s.numFactura),
                fecha: new Date().toLocaleString('es-CO', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                }),
            });
        }
    };

    const validablesCount = items.filter(it => it.files.cuv && it.files.rip && it.files.xml && !it.result).length;
    const subiblesCount = items.filter(it => it.result?.isValid && it.result?.allMatch && !it.uploaded).length;
    const hayAlgoCargado = items.some(it => it.files.cuv || it.files.rip || it.files.xml || it.result || it.uploaded);

    return (
        <div className="fade-up fade-up-1">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-[#111111] tracking-tight">Cargar Factura</h1>
                    <p className="mt-1 text-sm text-[#787774]">
                        Completa la información, sube los archivos y valida antes de subir al sistema. Puedes anexar varias facturas a la misma cuenta de cobro.
                    </p>
                </div>
                {hayAlgoCargado && (
                    <button
                        onClick={handleResetAll}
                        className="flex items-center gap-1.5 text-xs text-[#787774] hover:text-[#111111] transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Limpiar todo
                    </button>
                )}
            </div>

            {/* 1 — Período + Cuenta de cobro (compartidos por todas las facturas) */}
            <div style={{ border: '1px solid #EAEAEA', borderRadius: 8, backgroundColor: '#ffffff' }} className="p-4 mb-4 space-y-4">
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
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Número de Cuenta de Cobro</label>
                    <input
                        type="text"
                        value={numeroCuentaCobro}
                        onChange={e => setNumeroCuentaCobro(e.target.value)}
                        placeholder="Ej: CC-2026-001"
                        style={{
                            width: '100%',
                            borderRadius: 10,
                            border: '1px solid #CBD5E1',
                            padding: '8px 12px',
                            fontSize: 14,
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                    />
                    <p className="mt-1.5 text-xs text-[#787774]">
                        Si este número ya tiene facturas cargadas y activas, las nuevas se anexarán al mismo radicado.
                    </p>
                </div>
            </div>

            {/* 2 — Acciones por lote (solo si hay más de una factura pendiente) */}
            {(validablesCount > 1 || subiblesCount > 1) && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {validablesCount > 1 && (
                        <button
                            onClick={handleValidarTodas}
                            disabled={batchValidating}
                            style={{ borderRadius: 10, backgroundColor: '#346538' }}
                            className="flex-1 min-w-[220px] py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60 hover:opacity-90 transition-opacity"
                        >
                            {batchValidating
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Validando {validablesCount} facturas...</>
                                : <>Validar {validablesCount} facturas pendientes</>
                            }
                        </button>
                    )}
                    {subiblesCount > 1 && (
                        <button
                            onClick={handleSubirTodas}
                            disabled={batchUploading}
                            style={{ borderRadius: 10, backgroundColor: '#1F6C9F' }}
                            className="flex-1 min-w-[220px] py-2.5 text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60 hover:opacity-90 transition-opacity"
                        >
                            {batchUploading
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Subiendo {subiblesCount} facturas...</>
                                : <>Subir {subiblesCount} facturas validadas</>
                            }
                        </button>
                    )}
                </div>
            )}

            {/* 3 — Facturas */}
            <div className="space-y-4 mb-4">
                {items.map((item, idx) => (
                    <InvoiceItemCard
                        key={item.id}
                        index={idx}
                        item={item}
                        canRemove={items.length > 1 && !item.uploaded}
                        onFile={(slot, f) => handleFile(item.id, slot, f)}
                        onClear={(slot) => handleClear(item.id, slot)}
                        onValidar={() => handleValidarItem(item.id)}
                        onSubir={() => handleSubirItem(item.id)}
                        onRemove={() => handleRemoveItem(item.id)}
                    />
                ))}
            </div>

            {/* 4 — Agregar otra factura a esta cuenta */}
            <button
                onClick={handleAddItem}
                className="w-full py-2.5 mb-4 text-sm font-medium text-[#1F6C9F] hover:text-white border border-dashed border-[#A3D4F0] hover:bg-[#1F6C9F] rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Agregar otra factura a esta cuenta de cobro
            </button>

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
                            <p style={{ fontSize: 15, fontWeight: 600, color: '#111111', marginBottom: 4 }}>
                                {uploadModal.facturas.length > 1 ? `${uploadModal.facturas.length} facturas subidas correctamente` : 'Factura subida correctamente'}
                            </p>
                            <p style={{ fontSize: 13, color: '#787774' }}>Quedaron registradas en el sistema bajo el mismo radicado.</p>
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
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 4, borderTop: '1px solid #EAEAEA' }}>
                                <span style={{ color: '#787774', fontWeight: 500, fontSize: 13 }}>Facturas</span>
                                {uploadModal.facturas.map((f, i) => (
                                    <span key={i} style={{ fontFamily: 'monospace', fontSize: 13, color: '#111111' }}>{f}</span>
                                ))}
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

            {/* Modal límite de intentos CUV */}
            {modalLimiteCuv && createPortal(
                <div
                    style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onClick={() => setModalLimiteCuv(false)}
                >
                    <div
                        style={{ backgroundColor: '#fff', borderRadius: 16, padding: '32px 28px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertCircle style={{ width: 32, height: 32, color: '#B91C1C' }} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: 15, fontWeight: 700, color: '#111111', marginBottom: 8 }}>Límite de intentos alcanzado</p>
                            <p style={{ fontSize: 13, color: '#787774', lineHeight: 1.6 }}>
                                Solo se permiten <strong>{MAX_CUV_INTENTOS} intentos</strong> de validación por CUV en cada sesión.
                                Si el problema persiste, comunícate con{' '}
                                <a href="mailto:auditoriacuentas@idsn.gov.co" style={{ color: '#462882', fontWeight: 600 }}>
                                    auditoriacuentas@idsn.gov.co
                                </a>
                            </p>
                        </div>
                        <button
                            onClick={() => setModalLimiteCuv(false)}
                            style={{ borderRadius: 10, backgroundColor: '#B91C1C', cursor: 'pointer', width: '100%', padding: '10px 0', fontSize: 14, fontWeight: 600, color: '#fff', border: 'none' }}
                        >
                            Entendido
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
