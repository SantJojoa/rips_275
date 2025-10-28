import { useState } from 'react';
import { Search, Upload, FileJson, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { consultarCUV } from '../services/searchBill';
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
            setResult(data);
            toast.success('Consulta CUV exitosa');
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
        // Intentar parsear como JSON primero
        try {
            const json = JSON.parse(text);
            return json.CodigoUnicoValidacion || json.codigoUnicoValidacion;
        } catch {
            // Si no es JSON, buscar con regex en el texto
            const regex = /["']?CodigoUnicoValidacion["']?\s*:\s*["']([^"']+)["']/i;
            const match = text.match(regex);
            return match ? match[1] : null;
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
        <div className="px-6 py-10 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Consultar CUV</h1>
                <p className="text-slate-600">Ingresa el código CUV o arrastra un archivo JSON</p>
            </div>

            {/* Formulario de búsqueda */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="cuv" className="block text-sm font-medium text-slate-700 mb-2">
                            Código CUV
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                id="cuv"
                                value={codigoCuv}
                                onChange={(e) => setCodigoCuv(e.target.value)}
                                placeholder="Ingresa el código CUV"
                                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !codigoCuv.trim()}
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Consultando...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        Buscar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Zona de drag & drop */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`bg-white rounded-2xl shadow-sm border-2 border-dashed p-12 mb-6 transition-all ${isDragging
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-300 hover:border-purple-400'
                    }`}
            >
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                        <FileJson className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        Arrastra un archivo JSON o TXT aquí
                    </h3>
                    <p className="text-slate-600 mb-4">
                        El archivo debe contener la clave "CodigoUnicoValidacion"
                    </p>
                    <label className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer transition-colors flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Seleccionar archivo
                        <input
                            type="file"
                            accept=".json,.txt"
                            onChange={handleFileInput}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            {/* Resultados */}
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
                <div className={`rounded-lg p-6 mb-6 border-2 ${result.EsValido
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}>
                    <div className="flex items-start gap-3 mb-6">
                        {result.EsValido ? (
                            <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                            <h4 className={`text-xl font-bold mb-1 ${result.EsValido ? 'text-green-800' : 'text-red-800'
                                }`}>
                                {result.EsValido ? 'CUV Válido' : 'CUV No Válido'}
                            </h4>
                            <p className={result.EsValido ? 'text-green-700' : 'text-red-700'}>
                                {result.EsValido
                                    ? 'La información del CUV ha sido validada exitosamente'
                                    : 'El CUV consultado no es válido'}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <tbody className="divide-y divide-slate-200">
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700 bg-slate-50 w-1/3">
                                            Estado
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${result.EsValido
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {result.EsValido ? '✓ Válido' : '✗ No Válido'}
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
                                            {result.CodigoUnicoValidacion || 'N/A'}
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
