import { useState } from "react";
import DataTable from 'react-data-table-component';
import { apiFetch } from "../lib/api";

export default function Consultar() {
    const [numFactura, setNumFactura] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('consultas');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [visibleColsByTab, setVisibleColsByTab] = useState({});

    const buscarFactura = async (userId = null) => {
        if (!numFactura.trim()) {
            setError('Por favor ingrese un número de factura');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const url = `/api/auth/search/factura?num_factura=${numFactura}${userId ? `&user_id=${userId}` : ''}`;
            const response = await apiFetch(url);
            const result = await response.json();

            if (!response.ok) throw new Error(result.message || 'Error al buscar factura');

            console.log('Datos recibidos:', result); // Para debug

            if (!userId) {
                // Primera búsqueda: guardamos todo el resultado
                setData(result);
            } else {
                // Búsqueda con userId: actualizar datos manteniendo la lista de usuarios
                setData(prevData => {
                    if (!prevData) return result;
                    const newData = {
                        ...result,
                        users: prevData.users || result.users || []
                    };
                    console.log('Datos actualizados:', newData); // Para debug
                    return newData;
                });
            }

            setSelectedUserId(userId);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => e.key === 'Enter' && buscarFactura();

    const renderTabla = (datos, tabId, titulo) => {
        if (!datos || datos.length === 0) {
            return (
                <div className="text-center py-6 text-gray-500 italic">
                    No hay datos disponibles para {titulo}
                </div>
            );
        }

        // Construir lista de columnas, excluyendo campos de BD comunes
        const primerItem = datos[0] || {};
        const forbidden = [/^id$/i, /^id_user$/i, /^user_id$/i, /^iduser$/i, /^createdAt$/i, /^updatedAt$/i, /^created_at$/i, /^updated_at$/i];

        const baseKeys = Object.keys(primerItem).filter(k => k !== 'data' && !forbidden.some(rx => rx.test(k)));
        const dataKeys = primerItem.data ? Object.keys(primerItem.data).filter(k => !forbidden.some(rx => rx.test(k))) : [];
        // Construir lista de columnas posibles (identificadores únicos)
        const humanize = (s) => String(s).replace(/^data\./, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const possibleCols = [
            ...baseKeys.map(k => ({ id: k, label: humanize(k), type: 'base', key: k })),
            ...dataKeys.map(k => ({ id: `data.${k}`, label: humanize(k), type: 'data', key: k }))
        ];

        // Custom styles for react-data-table-component (visually nicer)
        const customStyles = {
            headRow: {
                style: {
                    backgroundColor: '#2563EB', // blue-600
                    borderBottomWidth: '0',
                }
            },
            headCells: {
                style: {
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: '700',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                }
            },
            rows: {
                style: {
                    minHeight: '48px',
                }
            },
            cells: {
                style: {
                    paddingLeft: '16px',
                    paddingRight: '16px',
                }
            },
            pagination: {
                style: {
                    borderTopWidth: '1px',
                    borderTopColor: '#E5E7EB'
                }
            }
        };

        // Visible columns for this tab (if user hasn't chosen, default = all possibleCols)
        const visibleIds = visibleColsByTab[tabId] ?? possibleCols.map(c => c.id);

        const toggleColumn = (colId) => {
            setVisibleColsByTab(prev => {
                const prevSet = new Set(prev[tabId] ?? possibleCols.map(c => c.id));
                if (prevSet.has(colId)) prevSet.delete(colId); else prevSet.add(colId);
                return { ...prev, [tabId]: Array.from(prevSet) };
            });
        };

        const selectAll = () => setVisibleColsByTab(prev => ({ ...prev, [tabId]: possibleCols.map(c => c.id) }));
        const clearAll = () => setVisibleColsByTab(prev => ({ ...prev, [tabId]: [] }));

        const columns = possibleCols
            .filter(c => visibleIds.includes(c.id))
            .map(c => {
                if (c.type === 'base') {
                    return {
                        name: c.label,
                        selector: row => row[c.key],
                        sortable: true,
                        cell: row => {
                            let valor = row[c.key];
                            if (valor && typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}/.test(valor)) {
                                try { valor = new Date(valor).toLocaleString('es-ES'); } catch { void 0; }
                            }
                            return <div className="text-sm text-gray-800">{valor ?? ''}</div>;
                        }
                    };
                }

                return {
                    name: c.label,
                    selector: row => row.data?.[c.key],
                    sortable: true,
                    cell: row => {
                        let valor = row.data?.[c.key];
                        if (valor && typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}/.test(valor)) {
                            try { valor = new Date(valor).toLocaleString('es-ES'); } catch { void 0; }
                        }
                        return <div className="text-sm text-gray-800">{valor ?? ''}</div>;
                    }
                };
            });

        return (
            <div>
                {/* Column filter checkboxes */}
                <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-800">Columnas</h4>
                        <div className="flex gap-2">
                            <button type="button" onClick={selectAll} className="px-2 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700">Seleccionar todo</button>
                            <button type="button" onClick={clearAll} className="px-2 py-1 bg-white text-red-600 border border-red-100 rounded-md text-xs hover:bg-red-50">Limpiar</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {possibleCols.map(col => (
                            <label key={col.id} className="flex items-center gap-3 p-2 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-100">
                                <input
                                    type="checkbox"
                                    checked={visibleIds.includes(col.id)}
                                    onChange={() => toggleColumn(col.id)}
                                    className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{col.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg shadow border border-gray-200 bg-white overflow-x-auto">
                    <DataTable
                        columns={columns}
                        data={datos}
                        pagination
                        highlightOnHover
                        dense
                        noHeader
                        persistTableHead
                        customStyles={customStyles}
                        noDataComponent={<div className="p-6 text-center text-gray-500">No hay datos disponibles</div>}
                    />
                </div>
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

            {/* Selector de Usuario */}
            {data?.users && data.users.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Usuario Seleccionado
                    </h3>
                    <div className="flex flex-col gap-4">
                        <select
                            value={selectedUserId || ""}
                            onChange={(e) => buscarFactura(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        >
                            <option value="" disabled>Seleccione un usuario</option>
                            {data.users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.tipo_doc} {user.num_doc} - {user.tipo_usuario}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Datos */}
            {data && !data.pendingUserSelection && (
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
                                value: (() => {
                                    if (!data) return 'No especificado';

                                    // Si tenemos un usuario específico
                                    if (data.usuario) {
                                        return `${data.usuario.tipo_doc || 'Sin tipo'} ${data.usuario.num_doc || 'Sin número'} - ${data.usuario.tipo_usuario || ''}`.trim();
                                    }

                                    // Si tenemos múltiples usuarios y uno está seleccionado
                                    if (data.users && selectedUserId) {
                                        const selectedUser = data.users.find(u => u.id === Number(selectedUserId));
                                        if (selectedUser) {
                                            return `${selectedUser.tipo_doc || 'Sin tipo'} ${selectedUser.num_doc || 'Sin número'} - ${selectedUser.tipo_usuario || ''}`.trim();
                                        }
                                    }

                                    return 'No especificado';
                                })()
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
                                    {renderTabla(tab.data, tab.id, tab.label)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
