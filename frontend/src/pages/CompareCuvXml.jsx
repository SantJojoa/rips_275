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

function PairResult({ item, index }) {
    const [open, setOpen] = useState(false);
    const { comparison, cuvData, message } = item;

    return (
        <div className={`rounded-xl border-2 overflow-hidden ${item.success
            ? comparison.isMatch ? 'border-green-300' : 'border-amber-300'
            : 'border-red-300'}`}>
            <button
                onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${item.success
                    ? comparison.isMatch ? 'bg-green-50 hover:bg-green-100' : 'bg-amber-50 hover:bg-amber-100'
                    : 'bg-red-50 hover:bg-red-100'}`}
            >
                <div className="flex items-center gap-3">
                    {item.success
                        ? comparison.isMatch
                            ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                            : <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        : <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                    <div>
                        <p className="font-semibold text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.cuvFileName} · {item.xmlFileName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {item.success && (
                        <span className={`text-sm font-semibold ${comparison.isMatch ? 'text-green-700' : 'text-amber-700'}`}>
                            {comparison.isMatch ? 'Coincide' : `Dif. $${Math.abs(comparison.difference).toLocaleString('es-CO')}`}
                        </span>
                    )}
                    {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </div>
            </button>

            {open && (
                <div className="bg-white px-5 py-4 border-t border-slate-200 space-y-4">
                    {!item.success ? (
                        <p className="text-red-700 text-sm">{item.message}</p>
                    ) : (
                        <>
                            <p className={`text-sm font-medium ${comparison.isMatch ? 'text-green-700' : 'text-amber-700'}`}>{message}</p>
                            <div className="grid md:grid-cols-2 gap-3">
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                    <p className="text-xs font-semibold text-slate-500 mb-1">
                                        Valor CUV ({cuvData.TotalValorServicios === 0 ? 'TotalFactura' : 'TotalValorServicios'})
                                    </p>
                                    <p className="text-xl font-bold text-blue-700">${comparison.totalValorServicios.toLocaleString('es-CO')}</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                    <p className="text-xs font-semibold text-slate-500 mb-1">Payable Amount (XML)</p>
                                    <p className="text-xl font-bold text-purple-700">${comparison.payableAmount.toLocaleString('es-CO')}</p>
                                </div>
                            </div>
                            <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                                <tbody className="divide-y divide-slate-200">
                                    {[
                                        ['Estado', (cuvData.EsValido === true || cuvData.ResultState === true) ? '✓ Válido' : '✗ Rechazado'],
                                        ['CUV', cuvData.CodigoUnicoValidacion || cuvData.CodigoUnicoValidacionToShow || 'N/A'],
                                        ['Proceso ID', cuvData.ProcesoId || 'N/A'],
                                        ['Total Factura', `$${(cuvData.TotalFactura || 0).toLocaleString('es-CO')}`],
                                        ['Código Prestador', cuvData.CodigoPrestador || 'N/A'],
                                        ['Usuarios', cuvData.CantidadUsuarios ?? 0],
                                        ['Atenciones', cuvData.CantidadAtenciones ?? 0],
                                    ].map(([label, value]) => (
                                        <tr key={label} className="hover:bg-slate-50">
                                            <td className="px-4 py-2 font-semibold text-slate-600 bg-slate-50 w-2/5">{label}</td>
                                            <td className="px-4 py-2 text-slate-800 font-mono break-all">{value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {cuvData.ResultadosValidacion?.length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h5 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" /> Errores de Validación
                                    </h5>
                                    <div className="space-y-2">
                                        {cuvData.ResultadosValidacion.map((v, i) => (
                                            <div key={i} className="bg-white rounded p-3 border border-red-200 text-sm">
                                                <div className="flex gap-2 mb-1">
                                                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800">{v.Clase}</span>
                                                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">{v.Codigo}</span>
                                                </div>
                                                <p className="font-semibold text-slate-800">{v.Descripcion}</p>
                                                {v.Observaciones && <p className="text-red-700 mt-1"><span className="font-semibold">Obs:</span> {v.Observaciones}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
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
        <div className="space-y-4">
            <div className={`rounded-xl p-5 border-2 flex items-start gap-4 ${comparison.isMatch ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'}`}>
                {comparison.isMatch
                    ? <CheckCircle2 className="w-7 h-7 text-green-600 flex-shrink-0 mt-0.5" />
                    : <XCircle className="w-7 h-7 text-amber-600 flex-shrink-0 mt-0.5" />}
                <div className="flex-1">
                    <p className={`text-lg font-bold mb-1 ${comparison.isMatch ? 'text-green-800' : 'text-amber-800'}`}>
                        {comparison.isMatch ? 'Los valores coinciden' : 'Los valores no coinciden'}
                    </p>
                    <p className={`text-sm ${comparison.isMatch ? 'text-green-700' : 'text-amber-700'}`}>{message}</p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <p className="text-xs font-semibold text-slate-500 mb-0.5">
                                Valor CUV ({cuvData.TotalValorServicios === 0 ? 'TotalFactura' : 'TotalValorServicios'})
                            </p>
                            <p className="text-xl font-bold text-blue-700">${comparison.totalValorServicios.toLocaleString('es-CO')}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <p className="text-xs font-semibold text-slate-500 mb-0.5">Payable Amount (XML)</p>
                            <p className="text-xl font-bold text-purple-700">${comparison.payableAmount.toLocaleString('es-CO')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                    <p className="font-semibold text-slate-700 text-sm">Detalles del CUV</p>
                </div>
                <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-200">
                        {[
                            ['Estado', (cuvData.EsValido === true || cuvData.ResultState === true) ? '✓ Válido' : '✗ Rechazado'],
                            ['CUV', cuvData.CodigoUnicoValidacion || cuvData.CodigoUnicoValidacionToShow || 'N/A'],
                            ['Proceso ID', cuvData.ProcesoId || 'N/A'],
                            ['Total Factura', `$${(cuvData.TotalFactura || 0).toLocaleString('es-CO')}`],
                            ['Código Prestador', cuvData.CodigoPrestador || 'N/A'],
                            ['Usuarios', cuvData.CantidadUsuarios ?? 0],
                            ['Atenciones', cuvData.CantidadAtenciones ?? 0],
                        ].map(([label, value]) => (
                            <tr key={label} className="hover:bg-slate-50">
                                <td className="px-5 py-2.5 font-semibold text-slate-600 bg-slate-50 w-2/5">{label}</td>
                                <td className="px-5 py-2.5 text-slate-800 font-mono break-all">{value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {cuvData.ResultadosValidacion?.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h5 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Errores de Validación
                    </h5>
                    <div className="space-y-2">
                        {cuvData.ResultadosValidacion.map((v, i) => (
                            <div key={i} className="bg-white rounded p-3 border border-red-200 text-sm">
                                <div className="flex gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800">{v.Clase}</span>
                                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">{v.Codigo}</span>
                                </div>
                                <p className="font-semibold text-slate-800">{v.Descripcion}</p>
                                {v.Observaciones && <p className="text-red-700 mt-1"><span className="font-semibold">Obs:</span> {v.Observaciones}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
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
        <div className="px-6 py-10 max-w-5xl mx-auto">
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-1">Comparar CUV y XML</h1>
                    <p className="text-slate-500 text-sm">
                        {mode === 'single' ? 'Un par CUV + XML. El nombre del archivo no importa.' : 'Múltiples archivos emparejados automáticamente por nombre.'}
                    </p>
                </div>
                {(singleCuvFile || singleXmlFile || cuvFiles.length > 0 || xmlFiles.length > 0) && (
                    <button onClick={clearAll} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 transition-colors mt-1">
                        <Trash2 className="w-4 h-4" /> Limpiar
                    </button>
                )}
            </div>

            {/* Mode toggle */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-8">
                <button
                    onClick={() => switchMode('single')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'single' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <File className="w-4 h-4" /> Un archivo
                </button>
                <button
                    onClick={() => switchMode('batch')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'batch' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Files className="w-4 h-4" /> Varios archivos
                </button>
            </div>

            {/* ── SINGLE MODE ── */}
            {mode === 'single' && (
                <>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* CUV single */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingSingleCuv(true); }}
                            onDragLeave={() => setIsDraggingSingleCuv(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDraggingSingleCuv(false); const f = e.dataTransfer.files[0]; if (f) handleSingleFile(f, ['.json', '.txt'], setSingleCuvFile); }}
                            className={`bg-white rounded-2xl shadow-sm border-2 border-dashed p-8 transition-all ${isDraggingSingleCuv ? 'border-blue-500 bg-blue-50' : singleCuvFile ? 'border-blue-400 bg-blue-50/30' : 'border-slate-300 hover:border-blue-400'}`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${singleCuvFile ? 'bg-blue-100' : 'bg-slate-100'}`}>
                                    <FileJson className={`w-7 h-7 ${singleCuvFile ? 'text-blue-600' : 'text-slate-400'}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-1">Archivo CUV</h3>
                                <p className="text-slate-500 text-sm mb-3">JSON o TXT</p>
                                {singleCuvFile && (
                                    <p className="text-xs text-blue-700 font-medium mb-3 truncate max-w-full px-2">{singleCuvFile.name}</p>
                                )}
                                <label className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors flex items-center gap-2 text-sm font-medium">
                                    <Upload className="w-4 h-4" />
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
                            className={`bg-white rounded-2xl shadow-sm border-2 border-dashed p-8 transition-all ${isDraggingSingleXml ? 'border-purple-500 bg-purple-50' : singleXmlFile ? 'border-purple-400 bg-purple-50/30' : 'border-slate-300 hover:border-purple-400'}`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${singleXmlFile ? 'bg-purple-100' : 'bg-slate-100'}`}>
                                    <FileCode className={`w-7 h-7 ${singleXmlFile ? 'text-purple-600' : 'text-slate-400'}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-1">Archivo XML</h3>
                                <p className="text-slate-500 text-sm mb-3">Factura electrónica</p>
                                {singleXmlFile && (
                                    <p className="text-xs text-purple-700 font-medium mb-3 truncate max-w-full px-2">{singleXmlFile.name}</p>
                                )}
                                <label className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors flex items-center gap-2 text-sm font-medium">
                                    <Upload className="w-4 h-4" />
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
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-semibold"
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
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* Drop CUV */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingCuv(true); }}
                            onDragLeave={() => setIsDraggingCuv(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDraggingCuv(false); addBatchFiles(e.dataTransfer.files, ['.json', '.txt'], setCuvFiles); }}
                            className={`bg-white rounded-2xl shadow-sm border-2 border-dashed p-8 transition-all ${isDraggingCuv ? 'border-blue-500 bg-blue-50' : cuvFiles.length ? 'border-blue-400 bg-blue-50/30' : 'border-slate-300 hover:border-blue-400'}`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${cuvFiles.length ? 'bg-blue-100' : 'bg-slate-100'}`}>
                                    <FileJson className={`w-7 h-7 ${cuvFiles.length ? 'text-blue-600' : 'text-slate-400'}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-1">Archivos CUV</h3>
                                <p className="text-slate-500 text-sm mb-3">JSON o TXT · múltiples</p>
                                <label className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors flex items-center gap-2 text-sm font-medium">
                                    <Upload className="w-4 h-4" /> Seleccionar archivos
                                    <input type="file" accept=".json,.txt" multiple onChange={(e) => addBatchFiles(e.target.files, ['.json', '.txt'], setCuvFiles)} className="hidden" />
                                </label>
                                {cuvFiles.length > 0 && (
                                    <div className="mt-4 w-full text-left space-y-1">
                                        {cuvFiles.map((f, i) => (
                                            <div key={i} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-1.5 border border-slate-200">
                                                <span className="text-slate-700 truncate">{f.name}</span>
                                                <button onClick={() => setCuvFiles(prev => prev.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-500 ml-2 flex-shrink-0">
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Drop XML */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDraggingXml(true); }}
                            onDragLeave={() => setIsDraggingXml(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDraggingXml(false); addBatchFiles(e.dataTransfer.files, ['.xml'], setXmlFiles); }}
                            className={`bg-white rounded-2xl shadow-sm border-2 border-dashed p-8 transition-all ${isDraggingXml ? 'border-purple-500 bg-purple-50' : xmlFiles.length ? 'border-purple-400 bg-purple-50/30' : 'border-slate-300 hover:border-purple-400'}`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${xmlFiles.length ? 'bg-purple-100' : 'bg-slate-100'}`}>
                                    <FileCode className={`w-7 h-7 ${xmlFiles.length ? 'text-purple-600' : 'text-slate-400'}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-1">Archivos XML</h3>
                                <p className="text-slate-500 text-sm mb-3">Facturas electrónicas · múltiples</p>
                                <label className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors flex items-center gap-2 text-sm font-medium">
                                    <Upload className="w-4 h-4" /> Seleccionar archivos
                                    <input type="file" accept=".xml" multiple onChange={(e) => addBatchFiles(e.target.files, ['.xml'], setXmlFiles)} className="hidden" />
                                </label>
                                {xmlFiles.length > 0 && (
                                    <div className="mt-4 w-full text-left space-y-1">
                                        {xmlFiles.map((f, i) => (
                                            <div key={i} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-1.5 border border-slate-200">
                                                <span className="text-slate-700 truncate">{f.name}</span>
                                                <button onClick={() => setXmlFiles(prev => prev.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-500 ml-2 flex-shrink-0">
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pares detectados */}
                    {(cuvFiles.length > 0 || xmlFiles.length > 0) && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
                            <h3 className="font-semibold text-slate-700 mb-3">Pares detectados</h3>
                            <div className="flex flex-wrap gap-3 text-sm">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                                    <CheckCircle2 className="w-4 h-4" /> {pairs.matched.length} pares listos
                                </span>
                                {pairs.onlyCuv.length > 0 && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
                                        <AlertCircle className="w-4 h-4" /> {pairs.onlyCuv.length} CUV sin XML
                                    </span>
                                )}
                                {pairs.onlyXml.length > 0 && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
                                        <AlertCircle className="w-4 h-4" /> {pairs.onlyXml.length} XML sin CUV
                                    </span>
                                )}
                            </div>
                            {pairs.matched.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {pairs.matched.map(name => (
                                        <span key={name} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">{name}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mb-8 flex justify-center">
                        <button
                            onClick={handleBatchCompare}
                            disabled={loading || pairs.matched.length === 0}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-semibold"
                        >
                            {loading
                                ? <><Loader2 className="w-5 h-5 animate-spin" /> Comparando {pairs.matched.length} pares...</>
                                : <><ArrowLeftRight className="w-5 h-5" /> Comparar {pairs.matched.length > 0 ? `${pairs.matched.length} pares` : 'archivos'}</>}
                        </button>
                    </div>

                    {batchResult && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-bold text-slate-800">Resultados</h2>
                                <div className="flex gap-2 text-sm">
                                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-medium">
                                        ✓ {batchResult.results.filter(r => r.success && r.comparison.isMatch).length} coinciden
                                    </span>
                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-medium">
                                        ⚠ {batchResult.results.filter(r => r.success && !r.comparison.isMatch).length} difieren
                                    </span>
                                    {batchResult.results.filter(r => !r.success).length > 0 && (
                                        <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full font-medium">
                                            ✗ {batchResult.results.filter(r => !r.success).length} error
                                        </span>
                                    )}
                                </div>
                            </div>
                            {batchResult.results.map((item, i) => (
                                <PairResult key={i} item={item} index={i} />
                            ))}
                            {(batchResult.unmatchedCuv?.length > 0 || batchResult.unmatchedXml?.length > 0) && (
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
                                    <p className="font-semibold mb-2">Sin par encontrado:</p>
                                    {batchResult.unmatchedCuv?.map(f => <p key={f} className="text-amber-700">CUV sin XML: {f}</p>)}
                                    {batchResult.unmatchedXml?.map(f => <p key={f} className="text-amber-700">XML sin CUV: {f}</p>)}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
