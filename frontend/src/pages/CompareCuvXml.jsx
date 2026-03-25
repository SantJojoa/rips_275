import { useState, useMemo } from 'react';
import { Upload, FileJson, FileCode, Loader2, AlertCircle, CheckCircle2, XCircle, ArrowLeftRight, ChevronDown, ChevronUp, Trash2, Files, File } from 'lucide-react';
import { compareCuvXmlBatch, compareCuvXml } from '../services/searchBill.js';
import { toast } from 'react-toastify';

function extractCuvKey(filename) {
    const m = filename.match(/^FEV(.+)_CUV\.(json|txt)$/i);
    return m ? m[1] : filename.replace(/\.[^/.]+$/, '');
}

function extractXmlKey(filename) {
    const m = filename.match(/^FEV(.+)\.xml$/i);
    return m ? m[1] : filename.replace(/\.[^/.]+$/, '');
}

function CuvDetailsTable({ cuvData }) {
    const rows = [
        ['Estado', (cuvData.EsValido === true || cuvData.ResultState === true) ? '✓ Válido' : '✗ Rechazado'],
        ['CUV', cuvData.CodigoUnicoValidacion || cuvData.CodigoUnicoValidacionToShow || 'N/A'],
        ['Proceso ID', cuvData.ProcesoId || 'N/A'],
        ['Total Factura', `$${(cuvData.TotalFactura || 0).toLocaleString('es-CO')}`],
        ['Prestador', cuvData.CodigoPrestador || 'N/A'],
        ['Usuarios', cuvData.CantidadUsuarios ?? 0],
        ['Atenciones', cuvData.CantidadAtenciones ?? 0],
    ];
    return (
        <table className="w-full border border-slate-200 rounded-lg overflow-hidden text-base">
            <tbody className="divide-y divide-slate-100">
                {rows.map(([label, value]) => (
                    <tr key={label} className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-semibold text-slate-500 bg-slate-50 w-1/3">{label}</td>
                        <td className="px-4 py-2 text-slate-800 font-mono break-all">{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function ValidationErrors({ list }) {
    if (!list?.length) return null;
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
            <p className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Errores de Validación
            </p>
            <div className="space-y-1.5">
                {list.map((v, i) => (
                    <div key={i} className="bg-white rounded p-2 border border-red-200 text-sm">
                        <div className="flex gap-1.5 mb-1">
                            <span className="px-1.5 py-0.5 rounded font-semibold bg-red-100 text-red-800">{v.Clase}</span>
                            <span className="px-1.5 py-0.5 rounded font-semibold bg-slate-100 text-slate-700">{v.Codigo}</span>
                        </div>
                        <p className="font-medium text-slate-800">{v.Descripcion}</p>
                        {v.Observaciones && <p className="text-red-700 mt-0.5"><span className="font-semibold">Obs:</span> {v.Observaciones}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

function PairResult({ item }) {
    const [open, setOpen] = useState(false);
    const { comparison, cuvData, message } = item;
    const isOk = item.success && comparison.isMatch;
    const isDiff = item.success && !comparison.isMatch;

    return (
        <div className={`rounded-lg border overflow-hidden ${isOk ? 'border-green-300' : isDiff ? 'border-amber-300' : 'border-red-300'}`}>
            <button
                onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${isOk ? 'bg-green-50 hover:bg-green-100' : isDiff ? 'bg-amber-50 hover:bg-amber-100' : 'bg-red-50 hover:bg-red-100'}`}
            >
                <div className="flex items-center gap-3 min-w-0">
                    {isOk ? <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                        : isDiff ? <XCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                            : <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />}
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-base leading-tight">FEV{item.name}</p>
                        <p className="text-sm text-slate-400 truncate">{item.cuvFileName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {item.success && (
                        <span className={`text-base font-bold ${isOk ? 'text-green-700' : 'text-amber-700'}`}>
                            {isOk ? 'OK' : `−$${Math.abs(comparison.difference).toLocaleString('es-CO')}`}
                        </span>
                    )}
                    {open ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
            </button>

            {open && (
                <div className="bg-white px-5 py-4 border-t border-slate-200 space-y-3">
                    {!item.success ? (
                        <p className="text-red-700 text-sm">{item.message}</p>
                    ) : (
                        <>
                            <p className={`text-sm font-medium ${isOk ? 'text-green-700' : 'text-amber-700'}`}>{message}</p>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                    <p className="text-xs text-slate-500">CUV ({cuvData.TotalValorServicios === 0 ? 'TotalFactura' : 'TotalValorServicios'})</p>
                                    <p className="font-bold text-blue-700 text-base">${comparison.totalValorServicios.toLocaleString('es-CO')}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                    <p className="text-xs text-slate-500">Payable Amount (XML)</p>
                                    <p className="font-bold text-green-700 text-base">${comparison.payableAmount.toLocaleString('es-CO')}</p>
                                </div>
                            </div>
                            <CuvDetailsTable cuvData={cuvData} />
                            <ValidationErrors list={cuvData.ResultadosValidacion} />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

function SingleResult({ result }) {
    const { comparison, cuvData, message } = result;
    return (
        <div className="space-y-3">
            <div className={`rounded-lg p-3 border-2 flex items-start gap-3 ${comparison.isMatch ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'}`}>
                {comparison.isMatch
                    ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    : <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />}
                <div className="flex-1">
                    <p className={`font-bold text-sm mb-0.5 ${comparison.isMatch ? 'text-green-800' : 'text-amber-800'}`}>
                        {comparison.isMatch ? 'Los valores coinciden' : 'Los valores no coinciden'}
                    </p>
                    <p className={`text-xs ${comparison.isMatch ? 'text-green-700' : 'text-amber-700'}`}>{message}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="bg-white rounded p-2 border border-slate-200">
                            <p className="text-xs text-slate-500">CUV ({cuvData.TotalValorServicios === 0 ? 'TotalFactura' : 'TotalValorServicios'})</p>
                            <p className="font-bold text-blue-700">${comparison.totalValorServicios.toLocaleString('es-CO')}</p>
                        </div>
                        <div className="bg-white rounded p-2 border border-slate-200">
                            <p className="text-xs text-slate-500">Payable Amount (XML)</p>
                            <p className="font-bold text-green-700">${comparison.payableAmount.toLocaleString('es-CO')}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <p className="text-xs font-semibold text-slate-600 px-3 py-1.5 bg-slate-50 border-b border-slate-200">Detalles del CUV</p>
                <CuvDetailsTable cuvData={cuvData} />
            </div>
            <ValidationErrors list={cuvData.ResultadosValidacion} />
        </div>
    );
}

export default function CompareCuvXml() {
    const [mode, setMode] = useState('single');

    // Single mode state
    const [singleCuvFile, setSingleCuvFile] = useState(null);
    const [singleXmlFile, setSingleXmlFile] = useState(null);
    const [singleResult, setSingleResult] = useState(null);
    const [isDraggingSingleCuv, setIsDraggingSingleCuv] = useState(false);
    const [isDraggingSingleXml, setIsDraggingSingleXml] = useState(false);

    // Batch mode state
    const [cuvFiles, setCuvFiles] = useState([]);
    const [xmlFiles, setXmlFiles] = useState([]);
    const [batchResult, setBatchResult] = useState(null);
    const [isDraggingCuv, setIsDraggingCuv] = useState(false);
    const [isDraggingXml, setIsDraggingXml] = useState(false);

    const [loading, setLoading] = useState(false);

    const pairs = useMemo(() => {
        const cuvMap = new Map(cuvFiles.map(f => [extractCuvKey(f.name), f]));
        const xmlMap = new Map(xmlFiles.map(f => [extractXmlKey(f.name), f]));
        const matched = [...cuvMap.keys()].filter(k => xmlMap.has(k));
        const onlyCuv = [...cuvMap.keys()].filter(k => !xmlMap.has(k));
        const onlyXml = [...xmlMap.keys()].filter(k => !cuvMap.has(k));
        return { matched, onlyCuv, onlyXml };
    }, [cuvFiles, xmlFiles]);

    const addBatchFiles = (incoming, accept, setter) => {
        const valid = [...incoming].filter(f => accept.some(ext => f.name.endsWith(ext)));
        const invalid = [...incoming].filter(f => !accept.some(ext => f.name.endsWith(ext)));
        if (invalid.length) toast.error(`Archivos no válidos ignorados: ${invalid.map(f => f.name).join(', ')}`);
        setter(prev => {
            const existing = new Set(prev.map(f => f.name));
            return [...prev, ...valid.filter(f => !existing.has(f.name))];
        });
    };

    const handleSingleFile = (file, accept, setter) => {
        if (!accept.some(ext => file.name.endsWith(ext))) {
            toast.error(`Tipo no válido. Se esperaba: ${accept.join(', ')}`);
            return;
        }
        setter(file);
    };

    const handleSingleCompare = async () => {
        if (!singleCuvFile || !singleXmlFile) {
            toast.error('Selecciona un archivo CUV y un archivo XML');
            return;
        }
        setLoading(true);
        setSingleResult(null);
        try {
            const data = await compareCuvXml(singleCuvFile, singleXmlFile);
            setSingleResult(data);
            data.comparison.isMatch ? toast.success('Los valores coinciden') : toast.warning('Los valores no coinciden');
        } catch (err) {
            toast.error(err.message || 'Error al comparar archivos');
        } finally {
            setLoading(false);
        }
    };

    const handleBatchCompare = async () => {
        if (!cuvFiles.length || !xmlFiles.length) {
            toast.error('Sube al menos un archivo CUV y un XML');
            return;
        }
        if (!pairs.matched.length) {
            toast.error('No hay pares coincidentes por nombre de archivo');
            return;
        }
        setLoading(true);
        setBatchResult(null);
        try {
            const data = await compareCuvXmlBatch(cuvFiles, xmlFiles);
            setBatchResult(data);
            const ok = data.results.filter(r => r.success && r.comparison.isMatch).length;
            const ko = data.results.filter(r => r.success && !r.comparison.isMatch).length;
            const err = data.results.filter(r => !r.success).length;
            toast.info(`Procesados ${data.total} pares — ✓ ${ok} coinciden, ⚠ ${ko} difieren${err ? `, ✗ ${err} errores` : ''}`);
        } catch (err) {
            toast.error(err.message || 'Error al comparar archivos');
        } finally {
            setLoading(false);
        }
    };

    const clearAll = () => {
        setSingleCuvFile(null);
        setSingleXmlFile(null);
        setSingleResult(null);
        setCuvFiles([]);
        setXmlFiles([]);
        setBatchResult(null);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        clearAll();
    };

    return (
        <div className="py-6">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Comparar CUV y XML</h1>
                    <p className="text-slate-400 text-base mt-1">
                        {mode === 'single' ? 'Un par CUV + XML — nombre no importa.' : 'Múltiples archivos emparejados por número FEV.'}
                    </p>
                </div>
                {(singleCuvFile || singleXmlFile || cuvFiles.length > 0 || xmlFiles.length > 0) && (
                    <button onClick={clearAll} className="flex items-center gap-2 text-base text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" /> Limpiar
                    </button>
                )}
            </div>

            {/* Mode toggle */}
            <div className="flex items-center gap-0.5 bg-slate-100 rounded-xl p-1 w-fit mb-8">
                <button
                    onClick={() => switchMode('single')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-base font-medium transition-all ${mode === 'single' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <File className="w-5 h-5" /> Un archivo
                </button>
                <button
                    onClick={() => switchMode('batch')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-base font-medium transition-all ${mode === 'batch' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Files className="w-5 h-5" /> Varios archivos
                </button>
            </div>

            {/* ── SINGLE MODE ── */}
            {mode === 'single' && (
                <>
                    <div className="grid md:grid-cols-2 gap-5 mb-6">
                        {/* CUV single */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingSingleCuv(true); }}
                            onDragLeave={() => setIsDraggingSingleCuv(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDraggingSingleCuv(false); const f = e.dataTransfer.files[0]; if (f) handleSingleFile(f, ['.json', '.txt'], setSingleCuvFile); }}
                            className={`bg-white rounded-2xl border-2 border-dashed p-6 transition-all ${isDraggingSingleCuv ? 'border-blue-500 bg-blue-50' : singleCuvFile ? 'border-blue-400 bg-blue-50/20' : 'border-slate-200 hover:border-blue-300'}`}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${singleCuvFile ? 'bg-blue-100' : 'bg-slate-100'}`}>
                                    <FileJson className={`w-7 h-7 ${singleCuvFile ? 'text-blue-600' : 'text-slate-400'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-lg font-semibold text-slate-700">Archivo CUV</p>
                                    <p className="text-sm text-slate-400 truncate">{singleCuvFile ? singleCuvFile.name : 'JSON o TXT'}</p>
                                </div>
                                <label className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer transition-colors flex items-center gap-2 text-base font-medium flex-shrink-0">
                                    <Upload className="w-5 h-5" />
                                    {singleCuvFile ? 'Cambiar' : 'Seleccionar'}
                                    <input type="file" accept=".json,.txt" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleSingleFile(f, ['.json', '.txt'], setSingleCuvFile); }} className="hidden" />
                                </label>
                            </div>
                        </div>

                        {/* XML single */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingSingleXml(true); }}
                            onDragLeave={() => setIsDraggingSingleXml(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDraggingSingleXml(false); const f = e.dataTransfer.files[0]; if (f) handleSingleFile(f, ['.xml'], setSingleXmlFile); }}
                            className={`bg-white rounded-2xl border-2 border-dashed p-6 transition-all ${isDraggingSingleXml ? 'border-green-500 bg-green-50' : singleXmlFile ? 'border-green-400 bg-green-50/20' : 'border-slate-200 hover:border-green-300'}`}
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${singleXmlFile ? 'bg-green-100' : 'bg-slate-100'}`}>
                                    <FileCode className={`w-7 h-7 ${singleXmlFile ? 'text-green-600' : 'text-slate-400'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-lg font-semibold text-slate-700">Archivo XML</p>
                                    <p className="text-sm text-slate-400 truncate">{singleXmlFile ? singleXmlFile.name : 'Factura electrónica'}</p>
                                </div>
                                <label className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 cursor-pointer transition-colors flex items-center gap-2 text-base font-medium flex-shrink-0">
                                    <Upload className="w-5 h-5" />
                                    {singleXmlFile ? 'Cambiar' : 'Seleccionar'}
                                    <input type="file" accept=".xml" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleSingleFile(f, ['.xml'], setSingleXmlFile); }} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 flex justify-center">
                        <button
                            onClick={handleSingleCompare}
                            disabled={loading || !singleCuvFile || !singleXmlFile}
                            className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-md flex items-center gap-2 text-base font-semibold"
                        >
                            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Comparando...</> : <><ArrowLeftRight className="w-5 h-5" /> Comparar</>}
                        </button>
                    </div>

                    {singleResult && <SingleResult result={singleResult} />}
                </>
            )}

            {/* ── BATCH MODE ── */}
            {mode === 'batch' && (
                <>
                    <div className="grid md:grid-cols-2 gap-5 mb-6">
                        {/* Drop CUV */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingCuv(true); }}
                            onDragLeave={() => setIsDraggingCuv(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDraggingCuv(false); addBatchFiles(e.dataTransfer.files, ['.json', '.txt'], setCuvFiles); }}
                            className={`bg-white rounded-2xl border-2 border-dashed p-5 transition-all ${isDraggingCuv ? 'border-blue-500 bg-blue-50' : cuvFiles.length ? 'border-blue-400 bg-blue-50/20' : 'border-slate-200 hover:border-blue-300'}`}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${cuvFiles.length ? 'bg-blue-100' : 'bg-slate-100'}`}>
                                    <FileJson className={`w-6 h-6 ${cuvFiles.length ? 'text-blue-600' : 'text-slate-400'}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-base font-semibold text-slate-700">Archivos CUV <span className="text-slate-400 font-normal">JSON / TXT</span></p>
                                </div>
                                <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors flex items-center gap-2 text-base font-medium">
                                    <Upload className="w-4 h-4" /> Agregar
                                    <input type="file" accept=".json,.txt" multiple onChange={(e) => addBatchFiles(e.target.files, ['.json', '.txt'], setCuvFiles)} className="hidden" />
                                </label>
                            </div>
                            {cuvFiles.length > 0 && (
                                <div className="space-y-1.5 max-h-44 overflow-y-auto">
                                    {cuvFiles.map((f, i) => (
                                        <div key={i} className="flex items-center justify-between text-sm bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                                            <span className="text-slate-600 truncate">{f.name}</span>
                                            <button onClick={() => setCuvFiles(prev => prev.filter((_, j) => j !== i))} className="text-slate-300 hover:text-red-400 ml-2 flex-shrink-0">
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {cuvFiles.length === 0 && <p className="text-base text-slate-400 text-center py-4">Arrastra archivos aquí</p>}
                        </div>

                        {/* Drop XML */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingXml(true); }}
                            onDragLeave={() => setIsDraggingXml(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDraggingXml(false); addBatchFiles(e.dataTransfer.files, ['.xml'], setXmlFiles); }}
                            className={`bg-white rounded-2xl border-2 border-dashed p-5 transition-all ${isDraggingXml ? 'border-green-500 bg-green-50' : xmlFiles.length ? 'border-green-400 bg-green-50/20' : 'border-slate-200 hover:border-green-300'}`}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${xmlFiles.length ? 'bg-green-100' : 'bg-slate-100'}`}>
                                    <FileCode className={`w-6 h-6 ${xmlFiles.length ? 'text-green-600' : 'text-slate-400'}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-base font-semibold text-slate-700">Archivos XML <span className="text-slate-400 font-normal">Facturas</span></p>
                                </div>
                                <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors flex items-center gap-2 text-base font-medium">
                                    <Upload className="w-4 h-4" /> Agregar
                                    <input type="file" accept=".xml" multiple onChange={(e) => addBatchFiles(e.target.files, ['.xml'], setXmlFiles)} className="hidden" />
                                </label>
                            </div>
                            {xmlFiles.length > 0 && (
                                <div className="space-y-1.5 max-h-44 overflow-y-auto">
                                    {xmlFiles.map((f, i) => (
                                        <div key={i} className="flex items-center justify-between text-sm bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                                            <span className="text-slate-600 truncate">{f.name}</span>
                                            <button onClick={() => setXmlFiles(prev => prev.filter((_, j) => j !== i))} className="text-slate-300 hover:text-red-400 ml-2 flex-shrink-0">
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {xmlFiles.length === 0 && <p className="text-base text-slate-400 text-center py-4">Arrastra archivos aquí</p>}
                        </div>
                    </div>

                    {/* Pares detectados */}
                    {(cuvFiles.length > 0 || xmlFiles.length > 0) && (
                        <div className="bg-slate-50 rounded-xl border border-slate-200 px-5 py-3 mb-5 flex flex-wrap items-center gap-2">
                            <span className="text-base font-semibold text-slate-500">Pares:</span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-800 text-base font-medium">
                                <CheckCircle2 className="w-4 h-4" /> {pairs.matched.length} listos
                            </span>
                            {pairs.onlyCuv.length > 0 && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-base font-medium">
                                    <AlertCircle className="w-4 h-4" /> {pairs.onlyCuv.length} CUV sin XML
                                </span>
                            )}
                            {pairs.onlyXml.length > 0 && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-base font-medium">
                                    <AlertCircle className="w-4 h-4" /> {pairs.onlyXml.length} XML sin CUV
                                </span>
                            )}
                            {pairs.matched.map(name => (
                                <span key={name} className="text-base px-2.5 py-0.5 bg-white text-slate-500 rounded-lg border border-slate-200">FEV{name}</span>
                            ))}
                        </div>
                    )}

                    <div className="mb-8 flex justify-center">
                        <button
                            onClick={handleBatchCompare}
                            disabled={loading || pairs.matched.length === 0}
                            className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-md flex items-center gap-2 text-base font-semibold"
                        >
                            {loading
                                ? <><Loader2 className="w-5 h-5 animate-spin" /> Comparando {pairs.matched.length} pares...</>
                                : <><ArrowLeftRight className="w-5 h-5" /> Comparar {pairs.matched.length > 0 ? `${pairs.matched.length} pares` : 'archivos'}</>}
                        </button>
                    </div>

                    {batchResult && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-lg font-bold text-slate-700">Resultados</p>
                                <div className="flex gap-2 text-base">
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                                        ✓ {batchResult.results.filter(r => r.success && r.comparison.isMatch).length} coinciden
                                    </span>
                                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-medium">
                                        ⚠ {batchResult.results.filter(r => r.success && !r.comparison.isMatch).length} difieren
                                    </span>
                                    {batchResult.results.filter(r => !r.success).length > 0 && (
                                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium">
                                            ✗ {batchResult.results.filter(r => !r.success).length} error
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {batchResult.results.map((item, i) => (
                                    <PairResult key={i} item={item} />
                                ))}
                            </div>
                            {(batchResult.unmatchedCuv?.length > 0 || batchResult.unmatchedXml?.length > 0) && (
                                <div className="mt-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500">
                                    <span className="font-semibold">Sin par: </span>
                                    {batchResult.unmatchedCuv?.map(f => <span key={f} className="text-amber-600 mr-2">CUV: {f}</span>)}
                                    {batchResult.unmatchedXml?.map(f => <span key={f} className="text-amber-600 mr-2">XML: {f}</span>)}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
