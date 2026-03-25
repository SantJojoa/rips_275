import { useState } from 'react';
import { Search, Upload, FileJson, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { consultarCUV } from '../services/searchBill.js';
import { toast } from 'react-toastify';

export default function SearchCuv() {
    const [codigoCuv, setCodigoCuv] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleSearch = async (cuv) => {
        if (!cuv || !cuv.trim()) {
            toast.error('Por favor ingrese un código CUV');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await consultarCUV(cuv.trim());

            if (data.ResultState === false || data.EsValido === false) {
                setResult(data);
                if (data.ResultState === false) {
                    toast.warning('CUV con errores de validación');
                }
            } else {
                setResult(data);
                toast.success('Consulta CUV exitosa');
            }
        } catch (err) {
            setError(err.message || 'Error al consultar el CUV');
            toast.error(err.message || 'Error al consultar el CUV');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch(codigoCuv);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const extractCuvFromText = (text) => {
        try {
            const json = JSON.parse(text);
            return json.CodigoUnicoValidacion
                || json.codigoUnicoValidacion
                || json['Código Unico de Validación (CUV)']
                || json['Codigo Unico de Validacion (CUV)']
                || json['CUV'];
        } catch {
            const patterns = [
                // Patrones con comillas JSON
                /["']?CodigoUnicoValidacion["']?\s*:\s*["']([^"']+)["']/i,
                /["']?Código\s+Unico\s+de\s+Validación\s*\(CUV\)["']?\s*:\s*["']([^"']+)["']/i,
                /["']?Codigo\s+Unico\s+de\s+Validacion\s*\(CUV\)["']?\s*:\s*["']([^"']+)["']/i,
                /["']?CUV["']?\s*:\s*["']([^"']+)["']/i,
                // Patrones para texto plano (sin comillas) - incluye hashes hexadecimales largos
                /Código\s+Unico\s+de\s+Validación\s*\(CUV\)\s*:\s*([a-fA-F0-9]+)/i,
                /Codigo\s+Unico\s+de\s+Validacion\s*\(CUV\)\s*:\s*([a-fA-F0-9]+)/i,
                /CodigoUnicoValidacion\s*:\s*([a-fA-F0-9]+)/i,
                /CUV\s*:\s*([a-fA-F0-9]+)/i,
                // Patrones alternativos alfanuméricos
                /Código\s+Unico\s+de\s+Validación\s*\(CUV\)\s*:\s*([a-zA-Z0-9]+)/i,
                /Codigo\s+Unico\s+de\s+Validacion\s*\(CUV\)\s*:\s*([a-zA-Z0-9]+)/i,
                /CodigoUnicoValidacion\s*:\s*([a-zA-Z0-9]+)/i,
                /CUV\s*:\s*([a-zA-Z0-9]+)/i
            ];

            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match && match[1]) {
                    return match[1].trim();
                }
            }

            return null;
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length === 0) return;

        const file = files[0];
        const isJson = file.name.endsWith('.json');
        const isTxt = file.name.endsWith('.txt');

        if (!isJson && !isTxt) {
            toast.error('Por favor arrastra un archivo JSON o TXT');
            return;
        }

        try {
            const text = await file.text();
            const cuv = extractCuvFromText(text);

            if (!cuv) {
                toast.error('No se encontró la clave "CodigoUnicoValidacion" en el archivo');
                return;
            }

            setCodigoCuv(cuv);
            toast.success(`Código CUV extraído del archivo ${isJson ? 'JSON' : 'TXT'}`);
            handleSearch(cuv);
        } catch (err) {
            toast.error('Error al leer el archivo: ' + err.message);
        }
    };

    const handleFileInput = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const isJson = file.name.endsWith('.json');
        const isTxt = file.name.endsWith('.txt');

        if (!isJson && !isTxt) {
            toast.error('Por favor selecciona un archivo JSON o TXT');
            return;
        }

        try {
            const text = await file.text();
            const cuv = extractCuvFromText(text);

            if (!cuv) {
                toast.error('No se encontró la clave "CodigoUnicoValidacion" en el archivo');
                return;
            }

            setCodigoCuv(cuv);
            toast.success(`Código CUV extraído del archivo ${isJson ? 'JSON' : 'TXT'}`);
            handleSearch(cuv);
        } catch (err) {
            toast.error('Error al leer el archivo: ' + err.message);
        }
    };

    return (
        <div className="py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-1">Consultar CUV</h1>
                <p className="text-slate-500">Ingresa el código CUV o arrastra un archivo JSON</p>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mb-6">
                {/* Formulario de búsqueda */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-center">
                    <label htmlFor="cuv" className="block text-base font-semibold text-slate-700 mb-3">
                        Código CUV
                    </label>
                    <form onSubmit={handleSubmit}>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                id="cuv"
                                value={codigoCuv}
                                onChange={(e) => setCodigoCuv(e.target.value)}
                                placeholder="Ingresa el código CUV"
                                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !codigoCuv.trim()}
                                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-base font-semibold"
                            >
                                {loading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Consultando...</>
                                ) : (
                                    <><Search className="w-5 h-5" /> Buscar</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Drop zone */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`bg-white rounded-2xl border-2 border-dashed p-6 transition-all flex items-center gap-5 ${isDragging ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-green-400'}`}
                >
                    <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <FileJson className="w-7 h-7 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-slate-700">Arrastra un archivo JSON o TXT</p>
                        <p className="text-sm text-slate-400">Debe contener la clave "CodigoUnicoValidacion"</p>
                    </div>
                    <label className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 cursor-pointer transition-colors flex items-center gap-2 text-base font-medium flex-shrink-0">
                        <Upload className="w-5 h-5" />
                        Seleccionar
                        <input type="file" accept=".json,.txt" onChange={handleFileInput} className="hidden" />
                    </label>
                </div>
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
                <div className={`rounded-lg p-6 mb-6 border-2 ${(result.EsValido === true || result.ResultState === true)
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                    }`}>
                    <div className="flex items-start gap-3 mb-6">
                        {(result.EsValido === true || result.ResultState === true) ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                            <h4 className={`text-xl font-bold mb-1 ${(result.EsValido === true || result.ResultState === true) ? 'text-green-800' : 'text-red-800'
                                }`}>
                                {(result.EsValido === true || result.ResultState === true) ? 'CUV Válido' : 'CUV Rechazado'}
                            </h4>
                            <p className={(result.EsValido === true || result.ResultState === true) ? 'text-green-700' : 'text-red-700'}>
                                {(result.EsValido === true || result.ResultState === true)
                                    ? 'La información del CUV ha sido validada exitosamente'
                                    : result.CodigoUnicoValidacionToShow || 'El CUV consultado fue rechazado'}
                            </p>
                        </div>
                    </div>

                    {/* Mostrar observaciones si hay errores de validación */}
                    {result.ResultadosValidacion && result.ResultadosValidacion.length > 0 && (
                        <div className="mb-6 bg-red-50 border border-red-300 rounded-lg p-4">
                            <h5 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                Errores de Validación
                            </h5>
                            <div className="space-y-3">
                                {result.ResultadosValidacion.map((validacion, index) => (
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
                                        {validacion.PathFuente && (
                                            <p className="text-xs text-slate-600 mt-2">
                                                <span className="font-semibold">Fuente:</span> {validacion.PathFuente} ({validacion.Fuente})
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <tbody className="divide-y divide-slate-200">
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 bg-slate-50 w-1/3">
                                            Estado
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${(result.EsValido === true || result.ResultState === true)
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {(result.EsValido === true || result.ResultState === true) ? '✓ Válido' : '✗ Rechazado'}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 bg-slate-50">
                                            Proceso ID
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900 font-mono">
                                            {result.ProcesoId || 'N/A'}
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 bg-slate-50">
                                            Código Único de Validación (CUV)
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900 font-mono break-all">
                                            {result.CodigoUnicoValidacion && result.CodigoUnicoValidacion !== '-'
                                                ? result.CodigoUnicoValidacion
                                                : (result.CodigoUnicoValidacionToShow || 'N/A')}
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 bg-slate-50">
                                            Total Factura
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            <span className="font-semibold text-green-700">
                                                ${(result.TotalFactura || 0).toLocaleString('es-CO')}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 bg-slate-50">
                                            Cantidad de Usuarios
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            {result.CantidadUsuarios || 0}
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 bg-slate-50">
                                            Cantidad de Atenciones
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            {result.CantidadAtenciones || 0}
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 bg-slate-50">
                                            Total Valor Servicios
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            <span className="font-semibold text-blue-700">
                                                ${(result.TotalValorServicios || 0).toLocaleString('es-CO')}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 bg-slate-50">
                                            Código Prestador
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900 font-mono">
                                            {result.CodigoPrestador || 'N/A'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
