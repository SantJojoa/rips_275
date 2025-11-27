import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { fetchBills, deleteBill, updateBill } from "../api/billsApi";
import { Edit, Save, Trash2, X, AlertCircle } from "lucide-react";

export default function BillsTable() {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ num_factura: "", valor_factura: "" });

    const loadBills = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchBills();

            if (data && data.facturas) {
                setBills(data.facturas);
            } else if (Array.isArray(data)) {
                setBills(data);
            } else {
                setBills([]);
            }
        } catch (err) {
            console.error('Error loading bills:', err);
            setError(err.message || 'Error al cargar facturas');
            setBills([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBills();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar esta factura?")) {
            try {
                await deleteBill(id);
                loadBills();
            } catch (err) {
                alert('Error al eliminar factura: ' + err.message);
            }
        }
    };

    const handleEdit = (bill) => {
        setEditingId(bill.id);
        setEditData({
            num_factura: bill.num_factura,
            valor_factura: bill.valor_factura ?? 0,
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData({ num_factura: "", valor_factura: "" });
    };

    const handleUpdate = async (id) => {
        try {
            await updateBill(id, editData);
            setEditingId(null);
            setEditData({ num_factura: "", valor_factura: "" });
            loadBills();
        } catch (err) {
            alert('Error al actualizar factura: ' + err.message);
        }
    };

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            width: "80px",
            center: true,
            cell: (row) => (
                <div className="font-semibold text-slate-600">{row.id}</div>
            ),
        },
        {
            name: "Número Factura",
            selector: (row) => row.num_factura,
            sortable: true,
            grow: 2,
            cell: (row) =>
                editingId === row.id ? (
                    <input
                        className="border-2 border-blue-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-blue-500 transition"
                        value={editData.num_factura}
                        onChange={(e) =>
                            setEditData({ ...editData, num_factura: e.target.value })
                        }
                        placeholder="Número de factura"
                    />
                ) : (
                    <span className="font-medium text-slate-800">{row.num_factura}</span>
                ),
        },
        {
            name: "Valor",
            selector: (row) => row.valor_factura,
            sortable: true,
            grow: 1,
            right: true,
            cell: (row) =>
                editingId === row.id ? (
                    <input
                        type="number"
                        step="0.01"
                        className="border-2 border-blue-300 rounded-lg px-3 py-2 text-sm w-full text-right focus:outline-none focus:border-blue-500 transition"
                        value={editData.valor_factura}
                        onChange={(e) =>
                            setEditData({ ...editData, valor_factura: e.target.value })
                        }
                        placeholder="0.00"
                    />
                ) : (
                    <span className="font-bold text-emerald-600">
                        ${Number(row.valor_factura ?? 0).toLocaleString('es-CO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </span>
                ),
        },
        {
            name: "Prestador",
            selector: (row) => row.Control?.Prestador?.nombre_prestador ?? "—",
            sortable: true,
            grow: 2,
            cell: (row) => (
                <div className="text-slate-700 truncate" title={row.Control?.Prestador?.nombre_prestador}>
                    {row.Control?.Prestador?.nombre_prestador ?? "—"}
                </div>
            ),
        },
        {
            name: "Periodo",
            selector: (row) => row.Control?.periodo_fac,
            sortable: true,
            width: "140px",
            center: true,
            cell: (row) => (
                <div className="text-center">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {row.Control?.periodo_fac ?? "?"} / {row.Control?.año ?? "?"}
                    </span>
                </div>
            ),
        },
        {
            name: "Acciones",
            width: "180px",
            center: true,
            cell: (row) => (
                <div className="flex gap-2 justify-center items-center">
                    {editingId === row.id ? (
                        <>
                            <button
                                onClick={() => handleUpdate(row.id)}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                title="Guardar cambios"
                            >
                                <Save size={16} />
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                title="Cancelar"
                            >
                                <X size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => handleEdit(row)}
                                className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                title="Editar"
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(row.id)}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                                title="Eliminar"
                            >
                                <Trash2 size={16} />
                            </button>
                        </>
                    )}
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: "#1e40af",
                minHeight: "56px",
                borderRadius: "12px 12px 0 0",
            },
        },
        headCells: {
            style: {
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                paddingLeft: "16px",
                paddingRight: "16px",
            },
        },
        rows: {
            style: {
                minHeight: "60px",
                fontSize: "14px",
                borderBottom: "1px solid #e2e8f0",
                transition: "background-color 0.2s ease",
                "&:hover": {
                    backgroundColor: "#f8fafc",
                    cursor: "pointer",
                },
                "&:last-of-type": {
                    borderBottom: "none",
                },
            },
        },
        cells: {
            style: {
                paddingLeft: "16px",
                paddingRight: "16px",
            },
        },
        pagination: {
            style: {
                borderTop: "2px solid #e2e8f0",
                minHeight: "56px",
                fontSize: "13px",
                color: "#475569",
                backgroundColor: "#f8fafc",
            },
            pageButtonsStyle: {
                borderRadius: "8px",
                height: "32px",
                width: "32px",
                padding: "4px",
                margin: "0 4px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                backgroundColor: "transparent",
                color: "#475569",
                fill: "#475569",
                "&:hover:not(:disabled)": {
                    backgroundColor: "#e2e8f0",
                },
                "&:disabled": {
                    cursor: "not-allowed",
                    opacity: 0.4,
                },
            },
        },
    };

    const paginationComponentOptions = {
        rowsPerPageText: "Filas por página:",
        rangeSeparatorText: "de",
        selectAllRowsItem: true,
        selectAllRowsItemText: "Todos",
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-slate-600">Cargando facturas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">
                        Gestión de Facturas
                    </h1>
                    <p className="text-slate-600">
                        Administra y controla todas las facturas del sistema
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <AlertCircle className="text-red-500 mr-3" size={20} />
                            <div>
                                <p className="text-red-800 font-semibold">Error</p>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Total Facturas</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{bills.length}</p>
                            </div>
                            <div className="bg-blue-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Valor Total</p>
                                <p className="text-3xl font-bold text-emerald-600 mt-1">
                                    ${bills.reduce((sum, bill) => sum + (Number(bill.valor_factura) || 0), 0).toLocaleString('es-CO')}
                                </p>
                            </div>
                            <div className="bg-emerald-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-600 text-sm font-medium">Promedio</p>
                                <p className="text-3xl font-bold text-amber-600 mt-1">
                                    ${bills.length > 0 ? Math.round(bills.reduce((sum, bill) => sum + (Number(bill.valor_factura) || 0), 0) / bills.length).toLocaleString('es-CO') : 0}
                                </p>
                            </div>
                            <div className="bg-amber-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                    <DataTable
                        columns={columns}
                        data={bills}
                        pagination
                        paginationComponentOptions={paginationComponentOptions}
                        highlightOnHover
                        pointerOnHover
                        customStyles={customStyles}
                        noDataComponent={
                            <div className="py-16 text-center">
                                <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-slate-600 text-lg font-medium mb-1">No hay facturas registradas</p>
                                <p className="text-slate-500 text-sm">Las facturas aparecerán aquí cuando se registren</p>
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    );
}