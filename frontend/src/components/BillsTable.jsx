import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { fetchBills, deleteBill, updateBill } from "../api/billsApi";
import { Edit, Save, Trash2 } from "lucide-react";

export default function BillsTable() {
    const [bills, setBills] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ num_factura: "", valor_factura: "" });

    const loadBills = async () => {
        const data = await fetchBills();
        setBills(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        loadBills();
    }, []);

    const handleDelete = async (id) => {
        if (confirm("¿Seguro que deseas eliminar esta factura?")) {
            await deleteBill(id);
            loadBills();
        }
    };

    const handleEdit = (bill) => {
        setEditingId(bill.id);
        setEditData({
            num_factura: bill.num_factura,
            valor_factura: bill.valor_factura ?? 0,
        });
    };

    const handleUpdate = async (id) => {
        await updateBill(id, editData);
        setEditingId(null);
        loadBills();
    };

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            width: "90px",
            center: true,
        },
        {
            name: "Número Factura",
            selector: (row) => row.num_factura,
            sortable: true,
            grow: 2,
            cell: (row) =>
                editingId === row.id ? (
                    <input
                        className="border border-slate-300 rounded px-3 py-2 text-sm w-full"
                        value={editData.num_factura}
                        onChange={(e) =>
                            setEditData({ ...editData, num_factura: e.target.value })
                        }
                    />
                ) : (
                    <span className="font-medium text-slate-700">{row.num_factura}</span>
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
                        className="border border-slate-300 rounded px-3 py-2 text-sm w-24 text-right"
                        value={editData.valor_factura}
                        onChange={(e) =>
                            setEditData({ ...editData, valor_factura: e.target.value })
                        }
                    />
                ) : (
                    <span className="font-semibold text-slate-800">
                        ${Number(row.valor_factura ?? 0).toLocaleString()}
                    </span>
                ),
        },
        {
            name: "Prestador",
            selector: (row) => row.Control?.Prestador?.nombre_prestador ?? "—",
            sortable: true,
            grow: 2,
            cell: (row) => (
                <span className="text-slate-700">{row.Control?.Prestador?.nombre_prestador ?? "—"}</span>
            ),
        },
        {
            name: "Periodo",
            selector: (row) =>
                `${row.Control?.periodo_fac ?? "?"} - ${row.Control?.año ?? "?"}`,
            sortable: true,
            width: "150px",
            center: true,
            cell: (row) => (
                <span className="text-slate-700">
                    {row.Control?.periodo_fac ?? "?"} / {row.Control?.año ?? "?"}
                </span>
            ),
        },
        {
            name: "Acciones",
            width: "200px",
            cell: (row) => (
                <div className="flex gap-3 justify-center">
                    {editingId === row.id ? (
                        <button
                            onClick={() => handleUpdate(row.id)}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md flex items-center justify-center shadow-sm transition"
                            title="Guardar"
                        >
                            <Save size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={() => handleEdit(row)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md flex items-center justify-center shadow-sm transition"
                            title="Editar"
                        >
                            <Edit size={16} />
                        </button>
                    )}
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md flex items-center justify-center shadow-sm transition"
                        title="Eliminar"
                    >
                        <Trash2 size={16} />
                    </button>
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
                backgroundColor: "#155dfc",
                minHeight: "52px",
            },
        },
        headCells: {
            style: {
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: "600",
                paddingLeft: "18px",
                paddingRight: "18px",
            },
        },
        rows: {
            style: {
                minHeight: "55px", // 👈 tabla más grande
                fontSize: "14px",
                "&:hover": {
                    backgroundColor: "#F1F5F9",
                },
            },
        },
        pagination: {
            style: {
                borderTop: "1px solid #E2E8F0",
                fontSize: "13px",
            },
        },
    };

    return (
        <div className="p-6 flex items-center justify-center">
            <div className="w-full max-w-5xl border border-slate-200 shadow-lg bg-white rounded-3xl p-10 transition">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-4">
                        Gestión de facturas
                    </h1>
                    <p className="text-slate-500 text-sm">Lista, edita y elimina las facturas registradas.</p>
                </div>

                <div className="rounded-xl shadow-lg bg-white overflow-hidden">
                    <DataTable
                        className="rounded-xl"
                        columns={columns}
                        data={bills}
                        pagination
                        highlightOnHover
                        dense={false}
                        customStyles={customStyles}
                        noDataComponent={
                            <div className="p-8 text-center text-slate-500 text-sm">
                                No hay facturas registradas.
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    );
}
