import { useState } from "react";
import { Search } from 'lucide-react';
import Select from 'react-select'
import { SearchBill } from '../services/searchBill.js';
import { exportFacturaToExcel } from '../utils/exportToExcel';
import RenderTabla from '../components/RenderTabla';
import { showError, showSuccess } from '../utils/toastUtils';

export default function Consultar() {
    const [numFactura, setNumFactura] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('consultas');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [visibleColsByTab, setVisibleColsByTab] = useState({});
    const [isFactura, setIsFactura] = useState(false);

    const handleKeyPress = (e) => e.key === 'Enter' && buscarFactura();

    const tabs = [
        { id: 'consultas', label: 'Consultas', data: data?.consultas },
        { id: 'procedimientos', label: 'Procedimientos', data: data?.procedimientos },
        { id: 'medicamentos', label: 'Medicamentos', data: data?.medicamentos },
        { id: 'hospitalizaciones', label: 'Hospitalizaciones', data: data?.hospitalizaciones },
        { id: 'urgencias', label: 'Urgencias', data: data?.urgencias },
        { id: 'otrosServicios', label: 'Otros Servicios', data: data?.otrosServicios },
    ];

    const buscarFactura = async (userId = null) => {
        try {
            setLoading(true);

            const result = await SearchBill(numFactura, userId);

            if (!userId) {
                setData(result);
            } else {
                setData(prevData => {
                    if (!prevData) return result;
                    return {
                        ...result,
                        users: prevData.users || result.users || []
                    };
                });
            }
            setSelectedUserId(userId);
            setIsFactura(true);
            showSuccess('Factura encontrada');
        } catch {
            showError('La factura no se encontró');
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = async () => {
        exportFacturaToExcel(data);
    };

    return (
        <>
            <div className="max-w-6xl mx-auto px-3 py-5">
                <div className="mb-5 text-center">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">
                        Consulta RIPS
                    </h1>
                    <p className="text-slate-600">
                        Busque información de facturas en el sistema.
                    </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-5 mb-2">

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

                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-slate-500">Cargando información...</p>
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

                {data?.users && data.users.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 mb-6">
                        <h3 className="text-1xl font-semibold text-slate-800 mb-4">Seleccionar usuario</h3>
                        <Select
                            options={data.users.map(user => ({
                                value: user.id,
                                label: `${user.tipo_doc} ${user.num_doc}`,
                            }))}
                            value={selectedUserId}
                            onChange={(e) => buscarFactura(e.value)}
                            placeholder="Seleccione un usuario"
                            classNamePrefix="react-select"
                            styles={{
                                container: (base) => ({ ...base, width: '100%' }),
                                control: (base) => ({
                                    ...base,
                                    borderRadius: 12,
                                    borderColor: '#CBD5E1',
                                    boxShadow: 'none',
                                    padding: '2px 4px'
                                }),
                                input: (base) => ({ ...base, color: 'inherit' }),
                                menu: (base) => ({ ...base, borderRadius: 12 }),
                            }}
                        />
                    </div>
                )}

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
                                        <RenderTabla
                                            datos={tab.data}
                                            tabId={tab.id}
                                            titulo={tab.label}
                                            visibleColsByTab={visibleColsByTab}
                                            setVisibleColsByTab={setVisibleColsByTab}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div >
                    </div >
                )}
            </div >
        </>
    );
}
