import DataTable from 'react-data-table-component';


export default function RenderTabla({ datos, tabId, titulo, visibleColsByTab, setVisibleColsByTab }) {
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
                    const date = new Date(valor);
                    if (!Number.isNaN(date.getTime())) {
                        valor = date.toLocaleString('es-ES');
                    }
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
                    data={Array.isArray(datos) ? datos : []}
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
