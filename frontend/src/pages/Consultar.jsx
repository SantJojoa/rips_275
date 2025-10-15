import { useState } from "react";
import DataTable from 'react-data-table-component';
import { apiFetch } from "../lib/api";
import * as XLSX from 'xlsx';
import { Search } from 'lucide-react';
import { saveAs } from 'file-saver';


export default function Consultar() {
    const [numFactura, setNumFactura] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('consultas');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [visibleColsByTab, setVisibleColsByTab] = useState({});
    const [isFactura, setIsFactura] = useState(false);

    const buscarFactura = async (userId = null) => {
        if (!numFactura.trim()) {
            setError('Por favor ingrese un número de factura');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Ensure userId is a string and not an object
            const userIdParam = userId && typeof userId === 'object' ? '' : `&user_id=${encodeURIComponent(String(userId || ''))}`;
            const url = `/api/auth/search/factura?num_factura=${encodeURIComponent(numFactura)}${userIdParam}`;
            const response = await apiFetch(url);
            const result = await response.json();

            if (!response.ok) throw new Error(result.message || 'Error al buscar factura');

            console.log('Datos recibidos:', result);

            if (!userId) {
                setData(result);
            } else {
                setData(prevData => {
                    if (!prevData) return result;
                    const newData = {
                        ...result,
                        users: prevData.users || result.users || []
                    };
                    return newData;
                });
            }

            setSelectedUserId(userId);
            setIsFactura(true);
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
                <div className="text-center py-8 text-slate-500 italic bg-white rounded-lg shadow-inner border border-slate-200">
                    No hay datos disponibles para {titulo}
                </div>
            );
        }

        const primerItem = datos[0] || {};
        const forbidden = [/^id$/i, /^id_user$/i, /^user_id$/i, /^createdAt$/i, /^updatedAt$/i, /^created_at$/i, /^updated_at$/i];
        const baseKeys = Object.keys(primerItem).filter(k => k !== 'data' && !forbidden.some(rx => rx.test(k)));
        const dataKeys = primerItem.data ? Object.keys(primerItem.data).filter(k => !forbidden.some(rx => rx.test(k))) : [];
        const humanize = (s) => String(s).replace(/^data\./, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        const possibleCols = [
            ...baseKeys.map(k => ({ id: k, label: humanize(k), type: 'base', key: k })),
            ...dataKeys.map(k => ({ id: `data.${k}`, label: humanize(k), type: 'data', key: k }))
        ];

        const customStyles = {
            headRow: {
                style: {
                    backgroundColor: '#155dfc', // blue-800
                }
            },
            headCells: {
                style: {
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: '500',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                }
            },
            rows: {
                style: {
                    minHeight: '40px',
                    '&:hover': {
                        backgroundColor: '#F1F5F9'
                    }
                }
            },
            pagination: {
                style: {
                    borderTop: '1px solid #E2E8F0',
                }
            }
        };

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
            .map(c => ({
                name: c.label,
                selector: row => c.type === 'base' ? row[c.key] : row.data?.[c.key],
                sortable: true,
                cell: row => {
                    let valor = c.type === 'base' ? row[c.key] : row.data?.[c.key];
                    if (valor && typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}/.test(valor)) {
                        try { valor = new Date(valor).toLocaleString('es-ES'); } catch { }
                    }
                    return <div className="text-sm text-slate-800">{valor ?? ''}</div>;
                }
            }));

        return (
            <div>
                <div className="mb-5 p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-slate-800">Columnas visibles</h4>
                        <div className="flex gap-2">
                            <button onClick={selectAll} className="cursor-pointer px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Seleccionar todo</button>
                            <button onClick={clearAll} className="cursor-pointer px-2 py-1 text-xs border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition">Limpiar</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {possibleCols.map(col => (
                            <label key={col.id} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-2 hover:bg-slate-100 transition">
                                <input
                                    type="checkbox"
                                    checked={visibleIds.includes(col.id)}
                                    onChange={() => toggleColumn(col.id)}
                                    className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-xs text-slate-700">{col.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 shadow-md bg-white overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={datos}
                        pagination
                        highlightOnHover
                        dense
                        noHeader
                        persistTableHead
                        customStyles={customStyles}
                        noDataComponent={<div className="p-6 text-center text-slate-500">No hay datos disponibles</div>}

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


    const exportToExcel = async () => {
        if (!data) {
            alert('No hay datos para exportar');
            return;
        }

        try {
            const workbook = XLSX.utils.book_new();

            // helper: turn array of objects (merging item.data) into sheet
            const createSheetFromArray = (name, arr) => {
                if (!arr || arr.length === 0) return false;
                const rows = arr.map(item => {
                    const plain = { ...item, ...(item.data || {}) };
                    delete plain.data;
                    return plain;
                });
                const ws = XLSX.utils.json_to_sheet(rows);
                // Excel limita a 31 chars por hoja
                XLSX.utils.book_append_sheet(workbook, ws, name.slice(0, 31));
                return true;
            };

            // Info general de factura
            const info = [{
                Numero_factura: data.transaccion?.num_factura || '',
                NIT: data.transaccion?.num_nit || '',
                Prestador: data.control?.Prestador?.nombre_prestador || '',
                Periodo: `${data.control?.periodo_fac || ''}/${data.control?.año || ''}`,
                Estado: data.control?.status || '',
                Total_Usuarios: data.users?.length ?? 1
            }];
            XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(info), 'Factura');

            // Si no hay users[], tratamos como factura "normal" (una sola serie de arrays globales)
            if (!data.users || data.users.length === 0) {
                createSheetFromArray('Consultas', data.consultas);
                createSheetFromArray('Procedimientos', data.procedimientos);
                createSheetFromArray('Medicamentos', data.medicamentos);
                createSheetFromArray('Hospitalizaciones', data.hospitalizaciones);
                createSheetFromArray('Urgencias', data.urgencias);
                createSheetFromArray('OtrosServicios', data.otrosServicios);
            } else {
                // Si hay usuarios, intentaremos obtener datos por cada usuario.
                // Si data ya contiene servicios globales que incluyen todos los usuarios, podemos
                // optar por filtrar localmente; pero para robustez, haremos fetch individual
                // solo si los arrays globales están vacíos o no contienen datos para los usuarios.

                // Determinar si los arrays globales ya contienen información (no vacíos).
                const globalHasData = (arr) => Array.isArray(arr) && arr.length > 0;
                const anyGlobalData = ['consultas', 'procedimientos', 'medicamentos', 'hospitalizaciones', 'urgencias', 'otrosServicios']
                    .some(k => globalHasData(data[k]));

                // Si hay datos globales y esos arrays ya contienen elementos, intentaremos
                // validar si los datos están por usuario (filtrando localmente). Pero por seguridad
                // preferimos hacer fetchs por usuario cuando la respuesta inicial no contiene servicios.
                let perUserResults = [];

                if (!anyGlobalData) {
                    // No hay servicios globales: traer por cada usuario
                    const promises = data.users.map(async (user) => {
                        const numFactura = encodeURIComponent(String(data.transaccion?.num_factura || ''));
                        const url = `/api/auth/search/factura?num_factura=${numFactura}&user_id=${encodeURIComponent(String(user.id))}`;
                        const resp = await apiFetch(url);
                        const json = await resp.json();
                        if (!resp.ok) {
                            // Si falla para un usuario, devolvemos un objeto vacío con solo user info
                            return { user, result: null, error: json?.message || `Error usuario ${user.id}` };
                        }
                        return { user, result: json, error: null };
                    });

                    perUserResults = await Promise.all(promises);
                } else {
                    // Hay datos globales — los agrupamos por user localmente:
                    perUserResults = data.users.map(user => {
                        const filterByUser = (arr) => (arr || []).filter(item => {
                            const uid = item.user_id ?? item.id_user ?? item.usuario_id ?? item.userId ?? item.usuario?.id;
                            // uid y user.id pueden llegar como string / number -> normalizamos
                            return String(uid) === String(user.id);
                        });

                        const result = {
                            consultas: filterByUser(data.consultas),
                            procedimientos: filterByUser(data.procedimientos),
                            medicamentos: filterByUser(data.medicamentos),
                            hospitalizaciones: filterByUser(data.hospitalizaciones),
                            urgencias: filterByUser(data.urgencias),
                            otrosServicios: filterByUser(data.otrosServicios),
                        };
                        return { user, result, error: null };
                    });
                }

                // Ahora creamos hojas para cada usuario con lo obtenido
                for (const entry of perUserResults) {
                    const user = entry.user;
                    const res = entry.result;

                    const sheetBase = `${user.tipo_doc || ''}-${user.num_doc || user.id || 'user'}`.replace(/[\\/?*[\]]/g, '_').slice(0, 20);

                    // Si el fetch falló o no devolvió servicios, aún así creamos la hoja Info del usuario
                    if (!res) {
                        const infoUser = [{
                            Tipo_Doc: user.tipo_doc || '',
                            Numero_Doc: user.num_doc || user.id || '',
                            Tipo_Usuario: user.tipo_usuario || '',
                            Nota: entry.error || 'Sin datos de servicios para este usuario'
                        }];
                        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(infoUser), `${sheetBase}_Info`.slice(0, 31));
                        continue;
                    }

                    // Si la estructura devuelta por el endpoint es la misma que `data` (con keys como consultas, procedimientos, etc.)
                    // usamos esas claves; si la respuesta trae las listas en otra forma, puedes adaptar aquí.
                    createSheetFromArray(`${sheetBase}_Consultas`, res.consultas);
                    createSheetFromArray(`${sheetBase}_Procedimientos`, res.procedimientos);
                    createSheetFromArray(`${sheetBase}_Medicamentos`, res.medicamentos);
                    createSheetFromArray(`${sheetBase}_Hospitalizaciones`, res.hospitalizaciones);
                    createSheetFromArray(`${sheetBase}_Urgencias`, res.urgencias);
                    createSheetFromArray(`${sheetBase}_OtrosServicios`, res.otrosServicios);

                    // Info del usuario
                    const infoUser = [{
                        Tipo_Doc: user.tipo_doc || '',
                        Numero_Doc: user.num_doc || user.id || '',
                        Tipo_Usuario: user.tipo_usuario || '',
                        Factura: data.transaccion?.num_factura || '',
                        NIT: data.transaccion?.num_nit || '',
                    }];
                    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(infoUser), `${sheetBase}_Info`.slice(0, 31));
                }
            }

            // Guardar workbook
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            const fileName = `Factura_${data.transaccion?.num_factura || 'Sin_numero'}.xlsx`;
            saveAs(blob, fileName);

        } catch (err) {
            console.error('Error exportando a excel:', err);
            alert('Ocurrió un error exportando el Excel. Revisa la consola.');
        }
    };


    return (
        <div className="max-w-6xl mx-auto px-3 py-5">
            {/* Buscador */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-5 mb-2">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Consulta RIPS</h1>
                    <p className="text-slate-500 mt-2 text-sm">Busque información de facturas en el sistema.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                    <div className="flex-1 w-full">
                        <label
                            htmlFor="numFactura"
                            className="block text-sm font-medium text-slate-600 mb-2"
                        >
                            Búsqueda por numero de factura
                        </label>
                        <input
                            type="text"
                            id="numFactura"
                            value={numFactura}
                            onChange={(e) => setNumFactura(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ej: 100245 o FAC-001"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>

                    <div className="flex sm:self-end">
                        <button
                            onClick={buscarFactura}
                            disabled={loading}
                            className="cursor-pointer px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 transition transform hover:scale-105"
                        >
                            <Search className="inline-block w-5 h-5 -mt-1" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-slate-500">Cargando información...</p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow mb-6 text-sm">
                    {error}
                </div>
            )}

            {isFactura && (
                <div className="flex justify-end p-4 bg-slate-50 border-t border-slate-200">
                    <button
                        onClick={exportToExcel}
                        className="cursor-pointer px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-green-700 transition"
                    >
                        Exportar a Excel
                    </button>
                </div>
            )}


            {/* Selector de Usuario */}
            {data?.users && data.users.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 mb-6">
                    <h3 className="text-1xl font-semibold text-slate-800 mb-4">Seleccionar usuario</h3>
                    <select
                        value={selectedUserId || ""}
                        onChange={(e) => buscarFactura(e.target.value)}
                        className="w-full px-3 text-sm py-2 border border-slate-300 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                        <option value="" disabled>Seleccione un usuario</option>
                        {data.users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.tipo_doc} {user.num_doc} - {user.tipo_usuario}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Datos */}
            {data && !data.pendingUserSelection && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                    <div className="bg-blue-600 p-4 ">
                        <h3 className="text-xl font-semibold text-white">Información de la Factura</h3>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50 ">
                        {[
                            { label: 'Número de Factura', value: data.transaccion?.num_factura },
                            { label: 'NIT', value: data.transaccion?.num_nit },
                            { label: 'Prestador', value: data.control?.Prestador?.nombre_prestador || 'N/A' },
                            {
                                label: 'Usuario',
                                value: (() => {
                                    if (!data) return 'No especificado';
                                    if (data.usuario) {
                                        return `${data.usuario.tipo_doc || ''} ${data.usuario.num_doc || ''} - ${data.usuario.tipo_usuario || ''} `.trim();
                                    }
                                    if (data.users && selectedUserId) {
                                        const selectedUser = data.users.find(u => u.id === Number(selectedUserId));
                                        if (selectedUser) {
                                            return `${selectedUser.tipo_doc || ''} ${selectedUser.num_doc || ''} - ${selectedUser.tipo_usuario || ''} `.trim();
                                        }
                                    }
                                    return 'No especificado';
                                })()
                            },
                            {
                                label: 'Periodo', value: `${data.control?.periodo_fac}/${data.control?.año}`
                            },
                            { label: 'Estado', value: data.control?.status }
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm  ">
                                <p className="text-xs uppercase font-medium text-slate-500">{item.label}</p>
                                <p className="mt-1 text-sm font-semibold text-slate-800">{item.value}</p>
                            </div>
                        ))}
                    </div >


                    {/* Tabs */}
                    < div className="border-t border-slate-200 bg-white" >
                        <nav className="flex overflow-x-auto gap-6 px-6 bg-slate-50">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`cursor-pointer py-3 text-sm font-medium border-b-2 transition-all ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
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
                    </div >
                </div >
            )}
        </div >
    );
}
