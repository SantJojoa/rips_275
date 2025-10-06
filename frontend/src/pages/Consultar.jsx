import { useState } from "react";
import { apiFetch } from "../lib/api";

export default function Consultar() {
    const [numFactura, setNumFactura] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('consultas');

    const buscarFactura = async () => {
        if (!numFactura.trim()) {
            setError('Por favor ingrese un número de factura');
            return;
        }

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await apiFetch(`/api/auth/search/factura?num_factura=${numFactura}`);
            const result = await response.json();

            if (!response.ok) throw new Error(result.message || 'Error al buscar factura');

            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => e.key === 'Enter' && buscarFactura();

    const renderTabla = (datos, titulo) => {
        if (!datos || datos.length === 0) {
            return (
                <div className="text-center py-6 text-gray-500 italic">
                    No hay datos disponibles para {titulo}
                </div>
            );
        }

        const primerItem = datos[0];
        let columnas = Object.keys(primerItem).filter(k => k !== 'data');

        if (primerItem.data) {
            const dataKeys = Object.keys(primerItem.data);
            columnas = [...columnas, ...dataKeys.map(k => `data.${k}`)];
        }

        return (
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                <table className="min-w-full bg-white rounded-lg">
                    <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <tr>
                            {columnas.map((col, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                                >
                                    {col.replace('data.', '')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {datos.map((item, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50 transition">
                                {columnas.map((col, colIndex) => {
                                    let valor = col.startsWith('data.')
                                        ? item.data?.[col.replace('data.', '')] || ''
                                        : item[col] || '';

                                    if (valor && typeof valor === 'string' && valor.match(/^\d{4}-\d{2}-\d{2}/)) {
                                        try {
                                            valor = new Date(valor).toLocaleString('es-ES');
                                        } catch { }
                                    }

                                    return (
                                        <td key={colIndex} className="px-4 py-3 text-sm text-gray-800">
                                            {valor}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const tabs = [
        { id: 'consultas', label: 'Consultas', data: data?.consultas },
        { id: 'procedimientos', label: 'Procedimientos', data: data?.procedimientos },
        { id: 'medicamentos', label: 'Medicamentos', data: data?.medicamentos },
        { id: 'hospitalizaciones', label: 'Hospitalizaciones', data: data?.hospitalizaciones },
        { id: 'urgencias', label: 'Urgencias', data: data?.urgencias },
        { id: 'otrosServicios', label: 'Otros Servicios', data: data?.otrosServicios },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
                    Consulta RIPS
                </h1>
                <p className="mt-2 text-gray-600">Busque información de facturas.</p>
            </div>

            {/* Buscador */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-10">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Buscar por Número de Factura</h2>
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label htmlFor="numFactura" className="block text-sm font-medium text-gray-700 mb-2">
                            Número de Factura
                        </label>
                        <input
                            type="text"
                            id="numFactura"
                            value={numFactura}
                            onChange={(e) => setNumFactura(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ej: 100245 o FAC-001"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                    </div>
                    <button
                        onClick={buscarFactura}
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition transform hover:scale-105"
                    >
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-500">Cargando información...</p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow-sm mb-6">
                    {error}
                </div>
            )}

            {/* Datos */}
            {data && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                        <h3 className="text-2xl font-bold text-white">Información de la Factura</h3>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { label: 'Número de Factura', value: data.transaccion?.num_factura },
                            { label: 'NIT', value: data.transaccion?.num_nit },
                            { label: 'Prestador', value: data.control?.Prestador?.nombre_prestador || 'N/A' },
                            { 
                                label: 'Usuario', 
                                value: data.usuario 
                                    ? `${data.usuario.tipo_doc || 'Sin tipo'} ${data.usuario.num_doc || 'Sin número'}`.trim() 
                                    : 'No especificado' 
                            },
                            { label: 'Periodo', value: `${data.control?.periodo_fac}/${data.control?.año}` },
                            { label: 'Estado', value: data.control?.status }
                        ].map((item, i) => (
                            <div key={i} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                <p className="text-xs uppercase font-medium text-gray-500">{item.label}</p>
                                <p className="mt-1 text-lg font-semibold text-gray-800">{item.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="border-t border-gray-200">
                        <nav className="flex space-x-6 px-6 bg-gray-50">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 text-sm font-medium transition border-b-2 ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                    {tab.data && tab.data.length > 0 && (
                                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                            {tab.data.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>

                        <div className="p-6">
                            {tabs.map((tab) => (
                                <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'}>
                                    {renderTabla(tab.data, tab.label)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
