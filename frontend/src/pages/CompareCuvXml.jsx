import { useState } from 'react';
import { Upload, FileJson, FileCode, Loader2, AlertCircle, CheckCircle2, XCircle, ArrowLeftRight } from 'lucide-react';
import { compareCuvXml } from '../services/searchBill';
import { toast } from 'react-toastify';

export default function CompareCuvXml() {
    const [cuvFile, setCuvFile] = useState(null);
    const [xmlFile, setXmlFile] = useState(null);
    const [cuvText, setCuvText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isDraggingCuv, setIsDraggingCuv] = useState(false);
    const [isDraggingXml, setIsDraggingXml] = useState(false);

    const handleCompare = async () => {
        const hasCuv = cuvFile || cuvText.trim();
        if (!hasCuv || !xmlFile) {
            toast.error('Por favor proporciona el código CUV (archivo o texto) y el archivo XML');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await compareCuvXml(cuvFile, xmlFile, cuvText.trim());
            setResult(data);

            if (data.comparison.isMatch) {
                toast.success('✓ Los valores coinciden');
            } else {
                toast.warning('⚠ Los valores no coinciden');
            }
        } catch (err) {
            setError(err.message || 'Error al comparar archivos');
            toast.error(err.message || 'Error al comparar archivos');
        } finally {
            setLoading(false);
        }
    };

    const handleCuvDrop = (e) => {
        e.preventDefault();
        setIsDraggingCuv(false);

        const file = e.dataTransfer.files[0];
        if (!file) return;

        const isValid = file.name.endsWith('.json') || file.name.endsWith('.txt');
        if (!isValid) {
            toast.error('El archivo CUV debe ser JSON o TXT');
            return;
        }

        setCuvFile(file);
        toast.success(`Archivo CUV cargado: ${file.name}`);
    };

    const handleXmlDrop = (e) => {
        e.preventDefault();
        setIsDraggingXml(false);

        const file = e.dataTransfer.files[0];
        if (!file) return;

        const isValid = file.name.endsWith('.xml');
        if (!isValid) {
            toast.error('El archivo debe ser XML');
            return;
        }

        setXmlFile(file);
        toast.success(`Archivo XML cargado: ${file.name}`);
    };

    const handleCuvFileInput = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isValid = file.name.endsWith('.json') || file.name.endsWith('.txt');
        if (!isValid) {
            toast.error('El archivo CUV debe ser JSON o TXT');
            return;
        }

        setCuvFile(file);
        toast.success(`Archivo CUV cargado: ${file.name}`);
    };

    const handleXmlFileInput = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isValid = file.name.endsWith('.xml');
        if (!isValid) {
            toast.error('El archivo debe ser XML');
            return;
        }

        setXmlFile(file);
        toast.success(`Archivo XML cargado: ${file.name}`);
    };

    return (
        <div className="px-6 py-10 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Comparar CUV y XML</h1>
                <p className="text-slate-600">Ingresa el código CUV o sube archivos para comparar valores</p>
            </div>

            {/* Input de texto para CUV */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                <label htmlFor="cuvInput" className="block text-sm font-medium text-slate-700 mb-2">
                    Código CUV (opcional si subes archivo)
                </label>
                <input
                    type="text"
                    id="cuvInput"
                    value={cuvText}
                    onChange={(e) => setCuvText(e.target.value)}
                    placeholder="Ingresa el código CUV directamente"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                />
                {cuvText && (
                    <p className="mt-2 text-sm text-blue-600">
                        ✓ Usando código CUV ingresado
                    </p>
                )}
            </div>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-50 text-slate-500 font-medium">O sube archivos</span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingCuv(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDraggingCuv(false); }}
                    onDrop={handleCuvDrop}
                    className={`bg-white rounded-2xl shadow-sm border-2 border-dashed p-8 transition-all ${isDraggingCuv
                        ? 'border-blue-500 bg-blue-50'
                        : cuvFile
                            ? 'border-green-500 bg-green-50'
                            : 'border-slate-300 hover:border-blue-400'
                        }`}
                >
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${cuvFile ? 'bg-green-100' : 'bg-blue-100'
                            }`}>
                            {cuvFile ? (
                                <CheckCircle2 className="w-7 h-7 text-green-600" />
                            ) : (
                                <FileJson className="w-7 h-7 text-blue-600" />
                            )}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                            Archivo CUV
                        </h3>
                        {cuvFile ? (
                            <p className="text-sm text-green-700 font-medium mb-3">
                                ✓ {cuvFile.name}
                            </p>
                        ) : (
                            <p className="text-slate-600 mb-3 text-sm">
                                Arrastra un archivo JSON o TXT
                            </p>
                        )}
                        <label className="px-5 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer transition-colors flex items-center gap-2 text-sm">
                            <Upload className="w-4 h-4" />
                            {cuvFile ? 'Cambiar archivo' : 'Seleccionar archivo'}
                            <input
                                type="file"
                                accept=".json,.txt"
                                onChange={handleCuvFileInput}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingXml(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDraggingXml(false); }}
                    onDrop={handleXmlDrop}
                    className={`bg-white rounded-2xl shadow-sm border-2 border-dashed p-8 transition-all ${isDraggingXml
                        ? 'border-purple-500 bg-purple-50'
                        : xmlFile
                            ? 'border-green-500 bg-green-50'
                            : 'border-slate-300 hover:border-purple-400'
                        }`}
                >
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${xmlFile ? 'bg-green-100' : 'bg-purple-100'
                            }`}>
                            {xmlFile ? (
                                <CheckCircle2 className="w-7 h-7 text-green-600" />
                            ) : (
                                <FileCode className="w-7 h-7 text-purple-600" />
                            )}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                            Archivo XML
                        </h3>
                        {xmlFile ? (
                            <p className="text-sm text-green-700 font-medium mb-3">
                                ✓ {xmlFile.name}
                            </p>
                        ) : (
                            <p className="text-slate-600 mb-3 text-sm">
                                Arrastra un archivo XML (factura)
                            </p>
                        )}
                        <label className="px-5 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer transition-colors flex items-center gap-2 text-sm">
                            <Upload className="w-4 h-4" />
                            {xmlFile ? 'Cambiar archivo' : 'Seleccionar archivo'}
                            <input
                                type="file"
                                accept=".xml"
                                onChange={handleXmlFileInput}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>
            </div>

            <div className="mb-6 flex justify-center">
                <button
                    onClick={handleCompare}
                    disabled={loading || (!cuvFile && !cuvText.trim()) || !xmlFile}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-semibold"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Comparando...
                        </>
                    ) : (
                        <>
                            <ArrowLeftRight className="w-5 h-5" />
                            Comparar Archivos
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-red-800 mb-1">Error</h4>
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {result && (
                <div className="space-y-6">
                    <div className={`rounded-xl p-6 border-2 ${result.comparison.isMatch
                        ? 'bg-green-50 border-green-300'
                        : 'bg-amber-50 border-amber-300'
                        }`}>
                        <div className="flex items-start gap-4">
                            {result.comparison.isMatch ? (
                                <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                            ) : (
                                <XCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                                <h3 className={`text-2xl font-bold mb-2 ${result.comparison.isMatch ? 'text-green-800' : 'text-amber-800'
                                    }`}>
                                    {result.comparison.isMatch ? '✓ Valores Coinciden' : '⚠ Valores No Coinciden'}
                                </h3>
                                <p className={result.comparison.isMatch ? 'text-green-700' : 'text-amber-700'}>
                                    {result.message}
                                </p>

                                <div className="mt-4 grid md:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                                        <p className="text-sm font-semibold text-slate-600 mb-1">
                                            Valor CUV
                                            <span className="text-xs text-slate-500 ml-1">
                                                ({result.cuvData.TotalValorServicios === 0 ? 'TotalFactura' : 'TotalValorServicios'})
                                            </span>
                                        </p>
                                        <p className="text-2xl font-bold text-blue-700">
                                            ${result.comparison.totalValorServicios.toLocaleString('es-CO')}
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                                        <p className="text-sm font-semibold text-slate-600 mb-1">Payable Amount (XML)</p>
                                        <p className="text-2xl font-bold text-purple-700">
                                            ${result.comparison.payableAmount.toLocaleString('es-CO')}
                                        </p>
                                    </div>
                                </div>

                                {!result.comparison.isMatch && (
                                    <div className="mt-4 bg-white rounded-lg p-4 border border-amber-200">
                                        <p className="text-sm font-semibold text-slate-600 mb-1">Diferencia</p>
                                        <p className="text-xl font-bold text-amber-700">
                                            ${Math.abs(result.comparison.difference).toLocaleString('es-CO')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    +                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-800">Detalles del CUV</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <tbody className="divide-y divide-slate-200">
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 bg-slate-50 w-1/3">
                                            Estado
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${(result.cuvData.EsValido === true || result.cuvData.ResultState === true)
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {(result.cuvData.EsValido === true || result.cuvData.ResultState === true) ? '✓ Válido' : '✗ Rechazado'}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 bg-slate-50">
                                            Código Único de Validación (CUV)
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900 font-mono break-all">
                                            {result.cuvData.CodigoUnicoValidacion || result.cuvData.CodigoUnicoValidacionToShow || 'N/A'}
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 bg-slate-50">
                                            Proceso ID
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900 font-mono">
                                            {result.cuvData.ProcesoId || 'N/A'}
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 bg-slate-50">
                                            Total Factura
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            <span className="font-semibold text-green-700">
                                                ${(result.cuvData.TotalFactura || 0).toLocaleString('es-CO')}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 bg-slate-50">
                                            Total Valor Servicios
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            <span className="font-semibold text-blue-700">
                                                ${(result.cuvData.TotalValorServicios || 0).toLocaleString('es-CO')}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 bg-slate-50">
                                            Cantidad de Usuarios
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            {result.cuvData.CantidadUsuarios || 0}
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 bg-slate-50">
                                            Cantidad de Atenciones
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            {result.cuvData.CantidadAtenciones || 0}
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 bg-slate-50">
                                            Código Prestador
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900 font-mono">
                                            {result.cuvData.CodigoPrestador || 'N/A'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {result.cuvData.ResultadosValidacion && result.cuvData.ResultadosValidacion.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <h4 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                Errores de Validación del CUV
                            </h4>
                            <div className="space-y-3">
                                {result.cuvData.ResultadosValidacion.map((validacion, index) => (
                                    <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                                        <div className="flex items-start gap-2 mb-2">
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800">
                                                {validacion.Clase}
                                            </span>
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                                                {validacion.Codigo}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-800 mb-1">
                                            {validacion.Descripcion}
                                        </p>
                                        {validacion.Observaciones && (
                                            <p className="text-sm text-red-700 bg-red-50 p-2 rounded mt-2">
                                                <span className="font-semibold">Observación:</span> {validacion.Observaciones}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
