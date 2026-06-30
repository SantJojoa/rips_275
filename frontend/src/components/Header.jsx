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

    const displayName = user?.nombres && user?.apellidos
        ? `${user.nombres} ${user.apellidos}`
        : user?.username;

    const roleLabel = user?.role === 'ADMIN' ? 'Admin' : 'Usuario';

    return (
        <header style={{ borderBottom: '1px solid #EAEAEA', backgroundColor: '#ffffff', height: '64px' }}
            className="sticky top-0 z-30 flex items-center justify-between px-6">
            <div className="flex items-center gap-3 w-full justify-between">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <img
                        src="logo-instituto.png"
                        alt="Logo IDSN"
                        className="h-8 w-auto object-contain"
                    />
                    <div style={{ borderLeft: '1px solid #EAEAEA' }} className="pl-3">
                        <p className="text-sm font-semibold text-[#111111] leading-tight tracking-tight">
                            Sistema FEV-RIPS
                        </p>
                        <p className="text-xs text-[#787774] leading-tight mt-0.5" style={{ fontFamily: 'var(--font-mono)' }}>
                            IDSN · Nariño
                        </p>
                    </div>
                </div>

                {/* User + Actions */}
                <div className="flex items-center gap-3">
                    <div style={{ border: '1px solid #EAEAEA', borderRadius: '6px' }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#F9F9F8]">
                        <span className="w-2 h-2 rounded-full bg-[#1aa154]" />
                        <span className="text-sm font-medium text-[#111111]">{displayName}</span>
                        <span style={{ borderLeft: '1px solid #EAEAEA' }}
                            className="pl-2 text-xs text-[#787774]">{roleLabel}</span>
                    </div>

                    <button
                        onClick={() => navigate('/dashboard')}
                        title="Ir al Panel"
                        style={{ border: '1px solid #EAEAEA', borderRadius: '6px' }}
                        className="p-2 bg-white hover:bg-[#F7F6F3] text-[#787774] hover:text-[#111111] transition-colors duration-150 cursor-pointer"
                    >
                        <House className="w-4 h-4" strokeWidth={1.5} />
                    </button>

                    <button
                        onClick={logout}
                        title="Cerrar sesión"
                        style={{ border: '1px solid #EAEAEA', borderRadius: '6px' }}
                        className="p-2 bg-white hover:bg-[#FDEBEC] hover:border-[#f5c6c6] text-[#787774] hover:text-[#9F2F2D] transition-colors duration-150 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                </div>
            </div>
        </header>
    );
}
