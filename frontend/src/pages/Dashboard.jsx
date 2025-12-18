import { useNavigate } from 'react-router-dom';
import { getUser, isAdmin } from '../lib/auth';
import { Search, Upload, UserPlus, List, Database, Download, ArrowLeftRight } from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();
    const user = getUser();
    const admin = isAdmin();

    const displayName = user?.nombres?.trim() ? user.nombres : user?.username;

    const conexionMinisterio = [
        {
            title: "Consultar CUV",
            description: "Consulta CUV en la base de datos del Ministerio de Salud.",
            icon: Database,
            action: () => navigate('/consultar-cuv'),
            color: "purple",
        },
        {
            title: "Comparar CUV y XML",
            description: "Compara el Total Valor Servicios del CUV con el PayableAmount del XML.",
            icon: ArrowLeftRight,
            action: () => navigate('/comparar-cuv-xml'),
            color: "indigo",
        },
        ...(admin ? [{
            title: "Descargar JSON",
            description: "Descarga archivos RIPS en formato JSON desde la plataforma del Ministerio de Salud.",
            icon: Download,
            action: () => navigate('/descargar-json'),
            color: "cyan",
        }] : []),
    ];

    const subirInformacion = [
        {
            title: "Consultar registros",
            description: "Busca y revisa registros existentes con facilidad.",
            icon: Search,
            action: () => navigate('/consultar'),
            color: "blue",
        },
        ...(admin ? [{
            title: "Subir JSON",
            description: "Carga archivos RIPS en formato JSON de manera rápida.",
            icon: Upload,
            action: () => navigate('/upload-json'),
            color: "green",
        }] : []),
    ];

    const administrar = admin ? [
        {
            title: "Gestionar facturas",
            description: "Listar y gestionar facturas.",
            icon: List,
            action: () => navigate('/gestionar-facturas'),
            color: "red",
        },
        {
            title: "Crear Usuario",
            description: "Crea nuevos usuarios para gestionar el sistema.",
            icon: UserPlus,
            action: () => navigate('/crear-usuario'),
            color: "amber",
        },
    ] : [];

    const colorClasses = {
        blue: "hover:bg-blue-500 hover:border-blue-500 hover:text-white",
        green: "hover:bg-green-500 hover:border-green-500 hover:text-white",
        amber: "hover:bg-amber-500 hover:border-amber-500 hover:text-white",
        red: "hover:bg-red-500 hover:border-red-500 hover:text-white",
        purple: "hover:bg-purple-500 hover:border-purple-500 hover:text-white",
        cyan: "hover:bg-cyan-500 hover:border-cyan-500 hover:text-white",
        indigo: "hover:bg-indigo-500 hover:border-indigo-500 hover:text-white",
    };

    const renderCard = (card, index) => {
        const Icon = card.icon;
        return (
            <button
                key={index}
                onClick={card.action}
                className={`group flex flex-col items-center justify-center gap-4 rounded-2xl 
                border border-slate-200 bg-white/80 backdrop-blur-sm 
                p-8 shadow-sm hover:shadow-md 
                hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer 
                ${colorClasses[card.color]}`}
            >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 transition-colors duration-300 group-hover:bg-white/20">
                    <Icon
                        className={`w-9 h-9 text-${card.color}-600 transition-colors duration-300 group-hover:text-white`}
                        strokeWidth={2}
                    />
                </div>
                <h2 className="text-lg font-semibold text-slate-800 group-hover:text-white transition-colors text-center">
                    {card.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500 text-center group-hover:text-white/80 transition-colors">
                    {card.description}
                </p>
            </button>
        );
    };

    return (
        <div className="px-6 py-10 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 mb-8 text-center">
                Bienvenido, <span className="text-blue-var">{displayName}</span>
            </h1>

            {/* Sección: Conexión Ministerio */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Database className="w-6 h-6 text-purple-600" />
                    Conexión Ministerio
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {conexionMinisterio.map((card, index) => renderCard(card, index))}
                </div>
            </div>

            {/* Sección: Subir Información */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Upload className="w-6 h-6 text-blue-600" />
                    Subir Información
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {subirInformacion.map((card, index) => renderCard(card, index))}
                </div>
            </div>

            {/* Sección: Administrar (solo admin) */}
            {admin && administrar.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <UserPlus className="w-6 h-6 text-amber-600" />
                        Administrar
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {administrar.map((card, index) => renderCard(card, index))}
                    </div>
                </div>
            )}
        </div>
    );
}
