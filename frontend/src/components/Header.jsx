import { useNavigate } from 'react-router-dom';
import { getUser, clearToken } from '../lib/auth';
import { House, LogOut } from "lucide-react";

export default function Header() {
    const navigate = useNavigate();
    const user = getUser();

    const logout = () => {
        clearToken();
        navigate('/login');
    };

    return (
        <header className="flex items-center justify-between px-6 py-2 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <img
                    src="logo-instituto.png"
                    alt="Logo IDSN"
                    className="h-8 w-auto object-contain"
                />

                <div className="leading-tight">
                    <h1 className="text-lg font-semibold text-slate-800 flex items-center gap-1">
                        Panel de Control
                        <span className="ml-1 text-green-var bg-green-50 px-2 py-0.5 rounded-md font-medium text-sm">
                            Sistema FEV-RIPS
                        </span>
                    </h1>
                    <span className="block text-[11px] text-slate-500 font-medium">
                        Instituto Departamental de Salud de Nariño
                    </span>
                </div>
            </div>

            {/* Datos del usuario y botones */}
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                    <img src="user-icon.svg" alt="" className="w-4 h-4 opacity-70" />
                    <span className="inline-block w-2 h-2 bg-green-var rounded-full" />
                    <span className="font-medium">
                        {user?.nombres && user?.apellidos
                            ? `${user.nombres} ${user.apellidos}`
                            : user?.username}
                    </span>
                    <span className="text-slate-400">({user?.role})</span>
                </span>

                <button
                    onClick={() => navigate('/dashboard')}
                    className="group p-2 rounded-full border border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:border-green-600 transition-all duration-200 ease-in-out cursor-pointer"
                    title="Ir al Dashboard"
                >
                    <House className="w-5 h-5 stroke-current transition-colors duration-200" />
                </button>

                <button
                    onClick={logout}
                    className="group p-2 rounded-full border border-red-500 bg-red-500 text-white hover:bg-transparent hover:text-red-500 hover:border-red-500 transition-all duration-200 cursor-pointer"
                    title="Cerrar sesión"
                >
                    <LogOut className="w-5 h-5 stroke-current transition-colors duration-200" />

                </button>
            </div>
        </header>
    );
}
