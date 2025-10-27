import { useNavigate } from 'react-router-dom';
import { getUser, isAdmin } from '../lib/auth';
import { Search, Upload, UserPlus, List } from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();
    const user = getUser();
    const admin = isAdmin();


    const displayName = user?.nombres?.trim() ? user.nombres : user?.username;

    const cards = [
        {
            title: "Consultar registros",
            description: "Busca y revisa registros existentes con facilidad.",
            icon: Search,
            action: () => navigate('/consultar'),
            color: "blue",
        },
        ...(admin
            ? [
                {
                    title: "Subir JSON",
                    description: "Carga archivos RIPS en formato JSON de manera rápida.",
                    icon: Upload,
                    action: () => navigate('/upload-json'),
                    color: "green",
                },
                {
                    title: "Crear Usuario",
                    description: "Crea nuevos usuarios para gestionar el sistema.",
                    icon: UserPlus,
                    action: () => navigate('/crear-usuario'),
                    color: "amber",
                },
                {
                    title: "Gestionar facturas",
                    description: "Listar y gestionar facturas.",
                    icon: List,
                    action: () => navigate('/gestionar-facturas'),
                    color: "red",
                },
            ]
            : []),
    ];

    return (
        <div className="px-6 py-10">
            <h1 className="text-2xl font-bold text-slate-800 mb-8 text-center">
                Bienvenido, <span className="text-blue-var">{displayName}</span>
            </h1>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card, index) => {
                    const Icon = card.icon;

                    const colorClasses = {
                        blue: "hover:bg-blue-500 hover:border-blue-500 hover:text-white",
                        green: "hover:bg-green-500 hover:border-green-500 hover:text-white",
                        amber: "hover:bg-amber-500 hover:border-amber-500 hover:text-white",
                        red: "hover:bg-red-500 hover:border-red-500 hover:text-white",
                    };

                    return (
                        <button
                            key={index}
                            onClick={card.action}
                            className={`group flex flex-col items-center justify-center gap-4 rounded-2xl 
                border border-slate-200 bg-white/80 backdrop-blur-sm 
                p-8 shadow-sm hover:shadow-md 
                hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer 
                ${colorClasses[card.color]}
                `}
                        >
                            <div
                                className={`flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 
                    transition-colors duration-300 group-hover:bg-white/20`}
                            >
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
                })}
            </div>
        </div>
    );
}
