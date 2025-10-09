import { useNavigate } from 'react-router-dom';
import { getUser, isAdmin, clearToken } from '../lib/auth';

export default function Header() {
    const navigate = useNavigate();
    const user = getUser();
    const admin = isAdmin();

    const logout = () => {
        clearToken();
        navigate('/login');
    };

    return (
        <header className="flex items-center justify-between px-10 py-4 bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-30">
            <div className="flex items-center gap-5">
                <span className="flex items-center justify-center p-2">
                    <img
                        src="logo-instituto.png"
                        alt="Logo IDSN"
                        className="h-12 w-auto object-contain drop-shadow-lg"
                    />
                </span>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        Panel de Control
                        <span className="ml-2 text-green-var bg-green-50 px-2 py-0.5 rounded-lg font-semibold shadow-sm text-xl">Sistema RIPS</span>
                    </h1>
                    <span className="block text-xs text-slate-500 mt-1 font-medium tracking-wide">Instituto Departamental de Salud de Nariño</span>
                </div>
            </div>
            <div className="flex items-center gap-6">

                <span className="flex items-center gap-2 text-base text-slate-700 bg-gradient-to-r from-slate-100 to-slate-200 px-4 py-2 rounded-full border border-slate-200 shadow-sm font-medium">
                    <img src="user-icon.svg" alt="" />

                    <span className="inline-block w-2 h-2 bg-green-var rounded-full mr-1">

                    </span>

                    {user?.nombres && user?.apellidos ? `${user.nombres} ${user.apellidos}` : user?.username}
                    <span className="ml-1 text-slate-500 font-semibold">({user?.role})</span>
                </span>
                <button
                    onClick={logout}
                    className="px-5 py-2 rounded-full bg-blue-var text-white text-base font-bold shadow-lg hover:bg-blue-light-var transition-all duration-200 cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-blue-var/40"
                >
                    <img src="logout-icon.svg" alt="" />
                </button>
            </div>
        </header>
    );
}
